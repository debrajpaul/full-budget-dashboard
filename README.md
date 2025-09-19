# Full Budget Dashboard

A Vite-powered React application for exploring personal finance data. The dashboard pulls metrics from a GraphQL API using Apollo Client and presents balances, spending breakdowns, and transaction history with a modern UI built with Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm (ships with Node.js)

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```
The app starts on `http://localhost:5173`. The server watches for file changes and hot-reloads the UI.

### Build for production
```bash
npm run build
```
This generates an optimized bundle in `dist/`. To preview the production build locally, run `npm run preview` after building.

## Authentication Flow
- The login page (`src/pages/Login.tsx`) submits the `login` mutation with the email, password, and workspace (tenant) selected by the user.
- On success, the returned JWT is stored in `localStorage` under the `jwt` key and the user is redirected to the dashboard.
- Routes under `/` are wrapped by an auth guard (`src/app/App.tsx`) that checks for the `jwt` token. If it is missing, the user is sent back to `/login`.
- To sign out manually during development, remove the `jwt` item from `localStorage` (e.g., via DevTools) or clear the browser storage.

## Configure the API Endpoint
The Apollo client uses the `VITE_API_URL` environment variable to determine which GraphQL endpoint to call. If the variable is not set, it defaults to `http://localhost:4005/graphql`.

1. Create a `.env.local` file in the project root:
   ```bash
   touch .env.local
   ```
2. Add your endpoint:
   ```ini
   VITE_API_URL=https://api.example.com/graphql
   ```
3. Restart `npm run dev` so Vite picks up the new setting.

Vite exposes the variable at build and runtime, and `src/lib/apollo.ts` reads it when constructing the Apollo client.

## Additional Scripts
- `npm run preview`: Serve the built app locally for a final check before deployment.

For more details on available GraphQL operations, see `src/graphql/queries.ts` and `src/graphql/mutations.ts`.
