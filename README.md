# URL Shortener Backend

Authenticated URL shortener service built with Express.js, TypeScript, and MongoDB.

## Features

- **Authentication**: Secure signup and login using JWT (stored in HTTP-only cookies).
- **URL Shortening**: Generate short URLs for long links.
- **Custom Codes**: Option to provide custom aliases for URLs.
- **Analytics**: Track click counts for each shortened URL.
- **Security**:
  - Password hashing with Bcrypt
  - Helmet for HTTP headers
  - CORS configuration
  - Input validation with Zod
- **Architecture**: Layered architecture (Controllers, Services, Repositories, Providers).

## Tech Stack

- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcrypt
- Zod
- Pino Logger

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Ensure `CLIENT_URL` matches your frontend URL (e.g., `http://localhost:5173`).

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Build & Start Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Auth

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `DELETE /api/v1/auth/logout` - Logout user (requires auth)

### URLs

- `POST /api/v1/urls/shorten` - Create a short URL (requires auth)
- `GET /api/v1/urls` - Get all URLs for logged-in user (requires auth)
- `DELETE /api/v1/urls/:id` - Delete a URL (requires auth)

### Redirection

- `GET /:shortCode` - Redirect to the original URL
