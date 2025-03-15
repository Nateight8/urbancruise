# Bare Project

A modern web application with a GraphQL API server and Next.js client.

## Project Structure

```
bare/
├── client/          # Next.js frontend application
├── server/          # GraphQL API server
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### Environment Variables

Both the client and server require environment variables to be set up. Copy the `.env.example` files in both directories and update them with your values:

```bash
# For server
cp server/.env.example server/.env

# For client
cp client/.env.example client/.env
```

### Installation

```bash
# Install dependencies for both client and server
cd server && pnpm install
cd ../client && pnpm install
```

### Development

```bash
# Start the server (from server directory)
pnpm dev

# Start the client (from client directory)
pnpm dev
```

## Features

- GraphQL API with Apollo Server
- Next.js frontend
- Authentication with NextAuth.js
- PostgreSQL database with Drizzle ORM
- TypeScript throughout
- Path aliases for clean imports
