# Unchained Grills — Website

A human intelligence show inside Web3. Built with Next.js 14, Tailwind CSS, Framer Motion, and Three.js.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Three.js** (WebGL particle background via direct import)
- **react-intersection-observer** (scroll reveal animations)
- **Formspree** (form submissions)
- **Beehiiv** (newsletter — requires account setup)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Configuration

### Formspree (Forms)

You need **two** Formspree forms — one for guest applications, one for questions.

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form → copy the form ID (e.g. `xpwzgkqb`)
3. Open `components/GuestForm.tsx` and replace:
   ```
   https://formspree.io/f/YOUR_FORM_ID
   ```
   with your actual URL, e.g.:
   ```
   https://formspree.io/f/xpwzgkqb
   ```
4. Open `components/AskQuestion.tsx` and replace:
   ```
   https://formspree.io/f/YOUR_QUESTION_FORM_ID
   ```
   with your second form's URL

Submissions will land directly in your email inbox.

---

### Beehiiv (Newsletter)

1. Create an account at [beehiiv.com](https://beehiiv.com)
2. Go to **Settings → Integrations → API**
3. Copy your **Publication ID** and **API Key**
4. Open `components/Newsletter.tsx`
5. Replace the temporary simulation block with:

```typescript
const res = await fetch(
  `https://api.beehiiv.com/v2/publications/YOUR_PUB_ID/subscriptions`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer YOUR_API_KEY`,
    },
    body: JSON.stringify({ email, reactivate_existing: true }),
  }
)
```

> **Important:** Never expose your API key in the browser. Move this fetch to a Next.js API route at `app/api/subscribe/route.ts` and call that from the component instead.

---

## Deploying to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js — no config needed
5. Click **Deploy**

Your site will be live at `your-project.vercel.app`.

---

## Project Structure

```
/app
  layout.tsx          → Root layout, metadata, font imports
  page.tsx            → Main page — assembles all sections

/components
  Navbar.tsx          → Transparent nav, becomes dark on scroll
  Hero.tsx            → Full-screen hero with Three.js particle field
  Marquee.tsx         → Scrolling ticker strip
  About.tsx           → Show description + Dipo's bio and photo
  Guests.tsx          → 4 guest cards with headshots, roles, links
  Episodes.tsx        → 4 episode cards linking to YouTube
  GuestForm.tsx       → Guest application (Formspree)
  AskQuestion.tsx     → Listener question form (Formspree)
  Newsletter.tsx      → Email signup (Beehiiv)
  FAQ.tsx             → Accordion FAQ
  Footer.tsx          → Logo, X + YouTube icons, nav links

/public
  /images
    logo.jpg          → Show logo
    dipo.jpg          → Founder/host photo
    leon.jpg          → Guest headshot
    juan.jpg          → Guest headshot
    kelano.jpg        → Guest headshot
    milad.jpg         → Guest headshot

/styles
  globals.css         → Design tokens, base styles, utility classes
```

---

## Adding a New Guest

1. Add their headshot to `/public/images/`
2. Open `components/Guests.tsx`
3. Add a new object to the `guests` array:

```typescript
{
  name: 'Guest Name',
  role: 'Their Role',
  detail: 'Short description',
  image: '/images/filename.jpg',
  xHandle: '@handle',
  xUrl: 'https://x.com/handle',
  episode: 'EP. 05',
  ytUrl: 'https://youtu.be/VIDEO_ID',
  epTitle: 'Episode Title Here',
}
```

4. Do the same in `components/Episodes.tsx` — add to the `episodes` array with the YouTube video ID for the thumbnail:

```typescript
thumbnail: 'https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg',
```

---

## Design Tokens

All colors and fonts live in `styles/globals.css` as CSS variables:

| Token | Value | Usage |
|---|---|---|
| `--gold` | `#C9A84C` | Primary accent — derived from logo |
| `--ink` | `#080808` | Background base |
| `--cream` | `#EDE6D6` | Primary text |
| `--font-display` | Bebas Neue | All headings |
| `--font-sans` | DM Sans | Body text |
| `--font-mono` | JetBrains Mono | Labels, tags, metadata |
