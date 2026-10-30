# Petopia — Pet Adoption Platform

A social platform for pet adoption, connecting pet owners with adopters and providing a community space for pet lovers.

## Local development

Environment setup (infrastructure, backend, chat service, `.env.local` template) and run instructions for every Petopia service live in the umbrella repository:

**https://github.com/Aaron-24DucAnh24/Petopia#readme**

The frontend needs the backend API and the chat service running locally.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |

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
