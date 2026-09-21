# Uncensored Grills

Uncensored Grills helps teams host and display unfiltered conversations with builders in the decentralized space. It captures guest applications, viewer questions, and newsletter signups while presenting video episodes in an immersive interface. 

## System Architecture

```mermaid
flowchart LR
  Client["Web Client"]
  Server["API Server"]
  Formspree["Formspree Service"]
  Kit["Kit API"]
  YouTube["YouTube Platform"]

  Client --> Server
  Client -- "Submit Form" --> Formspree
  Server -- "Add Subscriber" --> Kit
  Client -- "Load Embeds" --> YouTube

  style Client fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff
  style Server fill:#2e1065,stroke:#8b5cf6,stroke-width:2px,color:#fff
  style Formspree fill:#451a03,stroke:#f59e0b,stroke-width:2px,color:#fff
  style Kit fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff
  style YouTube fill:#4c0519,stroke:#ef4444,stroke-width:2px,color:#fff
```

## Features

* **Episode Showcase**: Display video episodes with direct integrations to external video platforms, complete with timestamps and descriptions.
* **Guest Applications**: Collect potential guest profiles and stories directly through an integrated form pipeline.
* **Listener Questions**: Allow the audience to submit questions for upcoming episodes, surfacing the best content for the hosts.
* **Newsletter Subscription**: Capture emails securely with an internal rate-limited pipeline to prevent spam and abuse.

```mermaid
sequenceDiagram
  actor User
  participant Client
  participant Server
  participant KitAPI as "Kit API"

  User->>Client: Enter email and submit
  Client->>Server: POST /api/subscribe
  Server->>Server: Verify rate limit by IP
  Server->>KitAPI: Forward subscriber data
  KitAPI->>Server: Return success confirmation
  Server->>Client: Return 200 OK
  Client->>User: Show success message
```

## Installation

Clone the Repository:
```bash
git clone https://github.com/jamzy-codes/unchained-grills.git
```

Install dependencies:
```bash
npm install
```

Configure your environment variables. Create a `.env.local` file in the root directory:
```bash
KIT_API_KEY=your_api_key_here
KIT_FORM_ID=your_form_id_here
```

Start the development server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser to see the application running.

## Usage

### Managing Guests and Episodes

The data for episodes and guests is managed directly within the component files. To add a new guest, update the `guests` array located inside `components/Guests.tsx`.

Add an entry with the following structure:
```typescript
{
  name: "New Guest Name",
  role: "Founder at Example",
  detail: "Brief description of their background",
  image: "/images/new-guest.jpg",
  xHandle: "@guest_handle",
  xUrl: "https://x.com/guest_handle",
  episode: "EP. 05",
  ytUrl: "https://youtu.be/example",
  epTitle: "Episode Title Here",
}
```

Follow the exact same process for episodes by editing the `episodes` array inside `components/Episodes.tsx`. Ensure you upload their corresponding image to the `public/images/` directory.

### Configuring Forms

The application uses Formspree to handle form submissions without requiring a database. You will need to create two forms on Formspree.

Update the endpoints in your components:
1. Open `components/GuestForm.tsx` and replace the `FORMSPREE_URL` constant with your guest form endpoint.
2. Open `components/AskQuestion.tsx` and replace the `FORMSPREE_URL` constant with your question form endpoint.

## API Documentation

### POST /api/subscribe

**Description**: Accepts an email address and registers the user to a newsletter via the Kit API. It includes an in-memory rate limiter that restricts requests to 5 attempts per minute per IP address.

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response (Success)**:
```json
{
  "success": true
}
```

**Response (Error)**:
```json
{
  "error": "Valid email required"
}
```

**Errors**:
* 400: Valid email required.
* 429: Too many subscription attempts. Please try again later.
* 500: Server error or missing configuration credentials.

**Environment Variables Required**:
* `KIT_API_KEY`: Authentication key for the Kit platform.
* `KIT_FORM_ID`: The unique identifier for the specific Kit subscription form.

## Technologies Used

| Technology | Purpose |
| :--- | :--- |
| Next.js | Application Framework |
| React | UI Library |
| Tailwind CSS | Styling |
| Three.js | 3D Graphics |
| Framer Motion | Animations |
| TypeScript | Type Safety |

## Author Info

* X (Twitter): https://x.com/Only_1_Jamzy

---

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)