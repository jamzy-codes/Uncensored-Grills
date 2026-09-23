import { NextResponse } from 'next/server'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5

const CLIENT_ERROR_MESSAGES = {
  invalidEmail: 'Please enter a valid email address.',
  rateLimited: 'Too many subscription attempts. Please try again later.',
  unavailable: 'Newsletter signup is temporarily unavailable.',
  rejected: 'Subscription failed. Please check your email and try again.',
  providerError: 'Newsletter provider is temporarily unavailable. Please try again later.',
  serverError: 'Server error. Please try again later.',
}

type RateLimitRecord = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

function getClientId(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim()

  return ip || request.headers.get('x-real-ip') || 'unknown'
}

function checkRateLimit(clientId: string) {
  const now = Date.now()
  const current = rateLimitStore.get(clientId)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return { limited: false, retryAfter: 0 }
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    }
  }

  current.count += 1
  return { limited: false, retryAfter: 0 }
}

async function parseRequestBody(request: Request) {
  try {
    const body = await request.json()

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return null
    }

    return body as Record<string, unknown>
  } catch {
    return null
  }
}

function isValidEmail(value: unknown) {
  if (typeof value !== 'string') return false

  const email = value.trim()
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function parseJsonResponse(response: Response) {
  try {
    const contentType = response.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

function getSafeKitErrorSummary(data: unknown) {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  if ('errors' in data && Array.isArray((data as { errors: unknown }).errors)) {
    return (data as { errors: unknown[] }).errors.map((error) => {
      if (typeof error === 'string') return error

      if (error && typeof error === 'object') {
        const errorRecord = error as Record<string, unknown>

        return {
          code: typeof errorRecord.code === 'string' ? errorRecord.code : undefined,
          title: typeof errorRecord.title === 'string' ? errorRecord.title : undefined,
          detail: typeof errorRecord.detail === 'string' ? errorRecord.detail : undefined,
        }
      }

      return 'Unknown Kit error'
    })
  }

  if ('message' in data && typeof (data as { message: unknown }).message === 'string') {
    return (data as { message: string }).message
  }

  return Object.keys(data)
}

function getClientKitError(response: Response) {
  if (response.status === 429) {
    return {
      status: 429,
      body: {
        error: CLIENT_ERROR_MESSAGES.rateLimited,
        code: 'KIT_RATE_LIMITED',
      },
    }
  }

  if (response.status === 400 || response.status === 422) {
    return {
      status: 400,
      body: {
        error: CLIENT_ERROR_MESSAGES.rejected,
        code: 'KIT_REJECTED_EMAIL',
      },
    }
  }

  if (response.status === 401 || response.status === 403 || response.status === 404) {
    return {
      status: 502,
      body: {
        error: CLIENT_ERROR_MESSAGES.unavailable,
        code: 'KIT_CONFIGURATION_ERROR',
      },
    }
  }

  return {
    status: 502,
    body: {
      error: CLIENT_ERROR_MESSAGES.providerError,
      code: 'KIT_PROVIDER_ERROR',
    },
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request)
    const email = typeof body?.email === 'string' ? body.email.trim() : ''

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: CLIENT_ERROR_MESSAGES.invalidEmail, code: 'INVALID_EMAIL' },
        { status: 400 }
      )
    }

    const rateLimit = checkRateLimit(getClientId(request))

    if (rateLimit.limited) {
      return NextResponse.json(
        { error: CLIENT_ERROR_MESSAGES.rateLimited, code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        }
      )
    }

    const kitApiKey = process.env.KIT_API_KEY
    const kitFormId = process.env.KIT_FORM_ID

    if (!kitApiKey || !kitFormId) {
      console.error('Newsletter subscription is missing server configuration.')
      return NextResponse.json(
        { error: CLIENT_ERROR_MESSAGES.unavailable, code: 'NEWSLETTER_CONFIG_MISSING' },
        { status: 503 }
      )
    }

    const createRes = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': kitApiKey,
      },
      body: JSON.stringify({
        email_address: email,
        state: 'inactive',
      }),
    })

    const createData = await parseJsonResponse(createRes)

    if (!createRes.ok) {
      console.error('Kit subscriber creation request failed.', {
        status: createRes.status,
        statusText: createRes.statusText,
        kitError: getSafeKitErrorSummary(createData),
      })

      const clientError = getClientKitError(createRes)

      return NextResponse.json(clientError.body, { status: clientError.status })
    }

    const res = await fetch(
      `https://api.kit.com/v4/forms/${encodeURIComponent(kitFormId)}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': kitApiKey,
        },
        body: JSON.stringify({
          email_address: email,
        }),
      }
    )

    const data = await parseJsonResponse(res)

    if (!res.ok) {
      console.error('Kit subscription request failed.', {
        status: res.status,
        statusText: res.statusText,
        kitError: getSafeKitErrorSummary(data),
      })

      const clientError = getClientKitError(res)

      return NextResponse.json(clientError.body, { status: clientError.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: CLIENT_ERROR_MESSAGES.serverError, code: 'SUBSCRIBE_SERVER_ERROR' },
      { status: 500 }
    )
  }
}

