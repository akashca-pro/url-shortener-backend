# URL Shortener Backend

A robust, production-ready URL shortener API built with Express.js, TypeScript, and MongoDB. Features JWT authentication, clean layered architecture, and comprehensive security measures.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Security](#security)
- [Docker](#docker)

## Features

- **Authentication** - Secure JWT-based auth with HTTP-only cookies
- **URL Shortening** - Generate short URLs with auto-generated or custom codes
- **Analytics** - Track click counts for each shortened URL
- **Input Validation** - Request validation using Zod schemas
- **Structured Logging** - Production-grade logging with Pino
- **Security Hardened** - Helmet, CORS, bcrypt password hashing

## Tech Stack

| Category      | Technology           |
| ------------- | -------------------- |
| Runtime       | Node.js (v18+)       |
| Framework     | Express.js           |
| Language      | TypeScript           |
| Database      | MongoDB + Mongoose   |
| Auth          | JWT (jsonwebtoken)   |
| Validation    | Zod                  |
| Security      | Helmet, bcrypt, CORS |
| Logging       | Pino + pino-pretty   |
| ID Generation | nanoid               |

## Architecture

The application follows a **layered architecture** pattern for clean separation of concerns:

```
┌─────────────────────────────────────────────┐
│             Presentation Layer              │
│    (Controllers, Routes, Middlewares)       │
├─────────────────────────────────────────────┤
│              Service Layer                  │
│         (Business Logic, DTOs)              │
├─────────────────────────────────────────────┤
│            Repository Layer                 │
│      (Data Access, Mongoose Models)         │
├─────────────────────────────────────────────┤
│             Provider Layer                  │
│   (External Services: JWT, Hashing, etc.)   │
└─────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local instance or MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd url-shortener/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript           |
| `npm start`     | Run production build                     |
| `npm run lint`  | Run ESLint                               |

## Environment Variables

Create a `.env` file based on `.env.example`:

| Variable                  | Description                        | Default                                   |
| ------------------------- | ---------------------------------- | ----------------------------------------- |
| `PORT`                    | Server port                        | `9000`                                    |
| `SERVICE_NAME`            | Service identifier for logs        | `url-shortener-backend`                   |
| `DATABASE_URL`            | MongoDB connection string          | `mongodb://localhost:27017/url-shortener` |
| `JWT_ACCESS_TOKEN_SECRET` | Secret key for JWT signing         | -                                         |
| `JWT_ACCESS_TOKEN_EXPIRY` | JWT token expiration               | `1d`                                      |
| `CLIENT_URL`              | Frontend URL for CORS              | `http://localhost:5173`                   |
| `BASE_URL`                | Base URL for generated short links | `http://localhost:9000`                   |

## API Reference

### Authentication

| Method   | Endpoint              | Description       | Auth |
| -------- | --------------------- | ----------------- | ---- |
| `POST`   | `/api/v1/auth/signup` | Register new user | No   |
| `POST`   | `/api/v1/auth/login`  | Login user        | No   |
| `DELETE` | `/api/v1/auth/logout` | Logout user       | Yes  |

#### Signup Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login Request

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### URLs

| Method   | Endpoint               | Description      | Auth |
| -------- | ---------------------- | ---------------- | ---- |
| `POST`   | `/api/v1/urls/shorten` | Create short URL | Yes  |
| `GET`    | `/api/v1/urls`         | Get user's URLs  | Yes  |
| `DELETE` | `/api/v1/urls/:id`     | Delete a URL     | Yes  |

#### Shorten URL Request

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customCode": "my-custom-code" // optional
}
```

### Redirection

| Method | Endpoint      | Description              | Auth |
| ------ | ------------- | ------------------------ | ---- |
| `GET`  | `/:shortCode` | Redirect to original URL | No   |

## Project Structure

```
src/
├── config/           # App configuration
├── const/            # Constants and enums
├── db/               # Database connection and models
├── dtos/             # Data Transfer Objects
├── presentation/     # Controllers, routes, middlewares
├── providers/        # External service integrations
├── repos/            # Data access layer
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── validation/       # Zod schemas
└── index.ts          # Application entry point
```

## Security

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Stored in HTTP-only, secure cookies
- **HTTP Headers**: Secured with Helmet
- **CORS**: Configured for specific origins
- **Input Validation**: All inputs validated with Zod
- **Error Handling**: Centralized error handling without leaking internals

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t url-shortener-backend .

# Run container
docker run -p 9000:9000 --env-file .env url-shortener-backend
```

## License

ISC
