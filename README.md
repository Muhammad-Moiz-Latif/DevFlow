<div align="center">

# ⚡ DevFlow

### **Ship faster. Collaborate in real time. Never refresh the board again.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=node.js&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://orm.drizzle.team/)
[![Redis](https://img.shields.io/badge/Redis-Socket.io-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

**DevFlow** is a full-stack, real-time project management platform — think Linear meets Jira, built from scratch with production-grade architecture. Workspaces, Kanban boards, live cursors, async notifications, and horizontal scaling out of the box.

[Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Documentation](./docs/DEVFLOW_EVALUATION.md) · [Tech Stack](#-tech-stack)

---

<img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Production Ready" />
<img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />

</div>

---

## 🚀 What is DevFlow?

DevFlow is a **developer-first issue tracker** designed for teams who live in the browser. Create workspaces, invite teammates, spin up projects, and manage work on a **live Kanban board** — where every drag, cursor movement, and comment update is synchronized instantly across all connected clients.

No polling. No stale state. No "did you see my update?" messages.

Built as a monorepo with a **React 19 frontend** and an **Express 5 API**, DevFlow demonstrates modern full-stack patterns: JWT auth with refresh tokens, Redis-backed WebSocket scaling, BullMQ job queues, Drizzle ORM migrations, and Docker-ready deployment.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏢 **Multi-tenant Workspaces** | Create isolated workspaces with unique slugs, avatars, and member roles |
| 📋 **Kanban Boards** | Drag-and-drop issues across `TODO → IN_PROGRESS → IN_REVIEW → DONE` |
| 👥 **Live Collaboration** | See who's online, watch their cursors move, and ghost-drag cards in real time |
| 🔔 **Smart Notifications** | Issue assignments, mentions, invites — delivered async via BullMQ workers |
| 📜 **Activity Logs** | Full audit trail of status changes, priority updates, and comments |
| 💬 **Issue Comments** | Threaded discussions tied directly to work items |
| 🏷️ **Labels & Priorities** | URGENT · HIGH · MEDIUM · LOW with custom label support |
| ✉️ **Team Invitations** | Email-based workspace invites with accept/reject flows |
| 🔐 **Auth Done Right** | Email/password, Google OAuth, email verification, password reset |
| 📊 **My Issues** | Personal dashboard of everything assigned to you, across all projects |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│  React Router · TanStack Query · Zustand · Socket.io Client     │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST + WebSocket
┌────────────────────────────▼────────────────────────────────────┐
│                     API SERVER (Express 5)                      │
│  Auth · Workspaces · Projects · Issues · Comments · Members     │
│  Socket.io + Redis Adapter (horizontal scaling)                 │
└──────┬──────────────────────────────┬───────────────────────────┘
       │                              │
┌──────▼──────┐              ┌────────▼────────┐
│  PostgreSQL │              │      Redis       │
│  (Drizzle)  │              │ Presence · PubSub│
└─────────────┘              └────────┬────────┘
                                      │
                             ┌────────▼────────┐
                             │  BullMQ Workers │
                             │ Notifications   │
                             │ Activity Logs   │
                             └─────────────────┘
```

### Real-time Kanban — How it works

1. **Join a room** — When you open a project board, the client emits `join-kanban-room` with the project ID.
2. **Presence in Redis** — Your avatar and socket ID are stored in a Redis hash, shared across all API instances.
3. **Live cursors** — Mouse coordinates are broadcast to everyone in the room (~throttled for performance).
4. **Ghost drag** — While you drag a card, other users see a ghost preview following your cursor.
5. **Persist on drop** — The final position is saved to PostgreSQL; all clients reconcile via TanStack Query.

This architecture scales horizontally — add more API containers behind a load balancer, and Redis keeps everyone in sync.

---

## 🛠 Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **React Router 7** | Client-side routing |
| **TanStack Query** | Server state & caching |
| **Zustand** | Client auth state |
| **Socket.io Client** | Real-time WebSocket connection |
| **@dnd-kit** | Accessible drag-and-drop |
| **React Hook Form + Zod** | Form validation |
| **Axios** | HTTP client with token refresh interceptor |

### Backend (`/server`)

| Technology | Purpose |
|------------|---------|
| **Express 5** | HTTP API framework |
| **TypeScript** | Type safety |
| **Drizzle ORM** | PostgreSQL schema & migrations |
| **Socket.io + Redis Adapter** | Scalable WebSockets |
| **BullMQ** | Background job processing |
| **ioredis** | Redis client |
| **JWT + bcrypt** | Authentication |
| **Passport + Google OAuth** | Social login |
| **Cloudinary** | Image uploads |
| **Nodemailer** | Transactional emails |
| **Multer** | Multipart form handling |
| **Zod** | Request validation |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database |
| **Redis** | Pub/sub, presence, job queues |
| **Docker Compose** | Local & production container orchestration |
| **Vercel** | Frontend deployment (SPA rewrites) |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 22+
- **PostgreSQL** 14+
- **Redis** 6+
- **npm** or **pnpm**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/DevFlow.git
cd DevFlow
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/devflow

# Redis
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

# Frontend
FRONTEND_URL=http://localhost:5173
PORT=3000

# Email (Nodemailer)
SENDER_EMAIL=your@gmail.com
SENDER_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Workers (set true for single-process dev)
RUN_WORKERS_INLINE=true
```

Run migrations and start the server:

```bash
npx drizzle-kit migrate
npm run dev          # API server on :3000
npm run dev:worker   # BullMQ workers (separate terminal, unless RUN_WORKERS_INLINE=true)
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_BACKEND_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the dev server:

```bash
npm run dev    # http://localhost:5173
```

### 4. Docker (alternative)

```bash
cd server
docker compose up --build
```

This spins up the API, workers, and Redis containers together.

---

## 📁 Project Structure

```
DevFlow/
├── client/                    # React frontend
│   ├── src/
│   │   ├── app/               # Routes, providers, router
│   │   ├── components/        # Shared UI (layout, navbar, sidebar)
│   │   ├── context/           # Auth & Socket providers
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Login, signup, verify email
│   │   │   ├── workspace/     # Workspace CRUD & dashboard
│   │   │   ├── project/       # Projects, Kanban board, live cursors
│   │   │   ├── issue/         # Issue CRUD & updates
│   │   │   └── members/       # Invites, notifications
│   │   ├── lib/               # Axios instances
│   │   └── stores/            # Zustand stores
│   └── vercel.json            # SPA deployment config
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── modules/           # Feature-based API modules
│   │   │   ├── auth/
│   │   │   ├── workspace/
│   │   │   ├── projects/
│   │   │   ├── issue/
│   │   │   ├── comment/
│   │   │   ├── members/
│   │   │   └── invitations/
│   │   ├── db/
│   │   │   ├── schema/        # Drizzle table definitions
│   │   │   └── migrations/    # SQL migration files
│   │   ├── sockets/           # WebSocket handlers & middleware
│   │   ├── queues/            # BullMQ queue definitions
│   │   ├── workers/           # Background job processors
│   │   ├── middlewares/       # JWT, validation, multer
│   │   └── utils/             # Email, notifications
│   ├── docker/                # Dockerfiles
│   └── docker-compose.yml
│
└── docs/
    └── DEVFLOW_EVALUATION.md  # Full project documentation
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/google` | Google OAuth |
| `GET` | `/api/auth/me` | Current user |
| `POST` | `/api/workspace` | Create workspace |
| `GET` | `/api/workspace/:id/projects` | List projects |
| `POST` | `/api/workspace/:id/project/:pid/issues` | Create issue |
| `PATCH` | `/api/workspace/:id/project/:pid/issues/:iid` | Update issue |
| `POST` | `/api/workspace/:id/issue/:iid/comments` | Add comment |
| `POST` | `/api/workspace/:id/invitations` | Invite member |

> Full API documentation is available in [docs/DEVFLOW_EVALUATION.md](./docs/DEVFLOW_EVALUATION.md).

---

## 🧪 Development Tips

```bash
# Run a second frontend instance (multi-user testing)
cd client && npm run dev:instance1   # port 5174

# Build for production
cd client && npm run build
cd server && npm run build

# Generate new database migration after schema changes
cd server && npx drizzle-kit generate
```

---

## 📖 Documentation

For an in-depth walkthrough of the architecture, data model, real-time systems, and design decisions — written for evaluators, reviewers, and new contributors:

**→ [DevFlow Project Evaluation](./docs/DEVFLOW_EVALUATION.md)**

---

## 🤝 Contributing

Contributions are welcome! Please read the evaluation document first to understand the architecture, then open an issue or pull request.

---

## 📄 License

ISC

---

<div align="center">

**Built with obsession for real-time collaboration.**

*DevFlow — where your team's work flows.*

</div>
