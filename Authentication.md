Authentication Flow

This document explains the full authentication lifecycle including signup, login, session management, and request authorization.

### Signup Flow (Mutation)

User signs up through GraphQL.

Frontend calls a createSession utility which sends a POST request to /session.

Backend session controller creates a new session in the database containing:

- session id (\_id)

- account id

- jti

- dateTimeCreated

- dateTimeLastRefreshed

Backend generates an accessToken and refreshToken using JWT.

Backend returns accessToken, refreshToken, and memberId.

Frontend stores the tokens in localStorage or cookies.

### Login Flow (Mutation)

Frontend calls an authenticate utility which sends a POST request to /authenticate.

Backend verifies the user password.

Backend deletes any previous session for the user by finding a session using the user id.

Backend creates a new session record.

Backend signs a new accessToken and refreshToken.

Backend returns accessToken and refreshToken.

Frontend replaces the stored tokens with the new tokens.

### Self Query and Session Validation

After authentication succeeds, the global authenticated state becomes true.

A self query automatically runs to fetch the authenticated user data.

On page visibility change, a getSession utility runs to confirm the session is still valid.

If needed, tokens are refreshed.

Authorization on API Requests

When the user is authenticated, the frontend attaches the Authorization header to every request:
Authorization: Bearer <accessToken>

Backend middleware reads the token and checks:

token validity

session existence in the database

session is not expired or revoked

If the session is valid, the request continues normally.

If the session is invalid, the backend returns 401 Unauthorized.

Summary

Authentication is session-based and uses JWT tokens.

Access and refresh tokens are generated on signup or login.

Sessions are stored in the database and can be revoked.

Every request includes an Authorization header.

The backend verifies the session before processing any request.
