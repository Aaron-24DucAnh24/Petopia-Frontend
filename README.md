# Petopia — Pet Adoption Platform

A social platform for pet adoption, connecting pet owners with adopters and providing a community space for pet lovers.

## Prerequisites

The backend API must be running locally before starting the frontend.
Backend repo: https://github.com/Aaron-24DucAnh24/Petopia-Backend.git

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_ENDPOINT` to your local API URL.

## Getting Started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |

## Sample Admin Account

```
Email:    anh.bui24ducanh24@hcmut.edu.vn
Password: 123456789
```

## Tech Stack

- **Next.js 13** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MobX** — global auth state
- **React Query v3** — server state & caching
- **React Hook Form** — form management
- **Axios** — HTTP client
- **CKEditor 5** — rich text editing
- **Braintree Web Drop-in** — payment UI
- **Cypress** — end-to-end testing
