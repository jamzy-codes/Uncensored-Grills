import { NextResponse } from 'next/server'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5

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

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request)
    const email = typeof body?.email === 'string' ? body.email.trim() : ''

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const rateLimit = checkRateLimit(getClientId(request))

    if (rateLimit.limited) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
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
        { error: 'Newsletter signup is temporarily unavailable.' },
        { status: 500 }
      )
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

    if (!res.ok) {
      console.error('Kit subscription request failed.', { status: res.status })
      return NextResponse.json(
        { error: 'Subscription failed. Please try again.' },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
