# Personal Webapp

A personal web application with Google OAuth authentication that restricts access to only authorized Google accounts. This provides a secure foundation for storing and accessing private data.

## Features

- **Google OAuth Authentication**: Secure "Login with Google" flow
- **Email Whitelist**: Only authorized email addresses can access the application
- **Session Management**: Persistent sessions across page refreshes
- **Modern Stack**: Built with Next.js 16, React 19, and TypeScript

## Prerequisites

- Node.js (LTS version - see `.nvmrc`)
- npm (comes with Node.js)
- Google Cloud OAuth credentials

## Environment Setup

1. **Copy the environment template**:

   ```bash
   # The .env.local file already exists with placeholders
   # Edit it with your actual values
   ```

2. **Configure environment variables** in `.env.local`:

   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your application URL (e.g., `http://localhost:3000`)
   - `AUTHORIZED_EMAIL`: Email address allowed to access the app

3. **Set up Google OAuth credentials**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new OAuth 2.0 Client ID
   - Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:

   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

- **Dev server**: `npm run dev` - Starts the development server with hot reload
- **Build**: `npm run build` - Creates an optimized production build
- **Start**: `npm start` - Runs the production build
- **Lint**: `npm run lint` - Runs ESLint to check code quality

## Project Structure

```
personal-webapp/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── public/             # Static assets
├── .env.local          # Environment variables (git-ignored)
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Git ignore rules
├── .npmrc              # npm configuration
├── .nvmrc              # Node version specification
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Security

- Environment variables are never committed to git (`.env.local` is in `.gitignore`)
- Only the authorized email address can access the application
- Sessions are encrypted using NextAuth.js

## Next Steps

1. Install and configure NextAuth.js
2. Set up Google OAuth provider
3. Implement email whitelist validation
4. Build login page and authenticated dashboard UI

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
