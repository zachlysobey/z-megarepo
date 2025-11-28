# User Story 3: Personal Webapp Scaffold

## User Story

As a developer, I want to have a personal web application with Google OAuth authentication that restricts access to only my Google account—a secure foundation for storing and accessing my private data.

## Goal

Build a minimal webapp scaffold with Google OAuth that only allows access to a single authorized Google account, establishing a secure foundation for future private data storage.

## Success Criteria

- [ ] "Login with Google" OAuth flow implemented
- [ ] Only authorized Google account can access the app
- [ ] Unauthorized accounts are rejected with clear error message
- [ ] Session persists across page refreshes
- [ ] User can log out successfully
- [ ] Clean, modern UI with authentication state display

## Context References

### Google OAuth Setup

- [Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server) - Official Google documentation for OAuth 2.0 implementation
- [Setting up OAuth 2.0 in Google API Console](https://support.google.com/cloud/answer/6158849) - How to create OAuth credentials and configure consent screen

### NextAuth.js Implementation

- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google) - Official NextAuth documentation for Google OAuth integration
- [NextAuth.js Callbacks](https://next-auth.js.org/configuration/callbacks) - Using callbacks for custom authentication logic

### Email Whitelisting & Security

- [Restricting OAuth Access by Email](https://stackoverflow.com/questions/37760695/google-oauth-restrict-access-to-specific-email-addresses) - Stack Overflow discussion on implementing email whitelists with Google OAuth
- [NextAuth signIn Callback for Email Validation](https://next-auth.js.org/configuration/callbacks#sign-in-callback) - How to validate user emails during sign-in
- [Secure Session Management with JWT and HttpOnly Cookies](https://medium.com/@prashantramnyc/secure-session-management-with-jwt-and-httponly-cookies-best-practices-8b8b5c8c3f8e) - Best practices for secure token storage

### General Security Best Practices

- CSRF protection with SameSite cookies
- Short-lived access tokens with refresh token rotation
- Environment variable management for sensitive credentials

### Next.js

- [Next.js Documentation](https://nextjs.org/docs) - Official Next.js documentation
- [Next.js Authentication](https://nextjs.org/docs/authentication) - Authentication features in Next.js

## Tasks

1) Initialize Next.js project
1) Built & test project in CI
1) Install and configure NextAuth.js
1) Set up Google Cloud OAuth credentials
1) Configure NextAuth with Google provider
1) Implement email whitelist validation
1) Build login page and authenticated dashboard UI
1) Add session management and route protection
1) Test authentication flow and security

## Future Iterations
