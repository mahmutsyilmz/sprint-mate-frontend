# Sprint Mate Frontend

A React 19 + TypeScript frontend for the Sprint Mate developer matchmaking platform. Provides a VS Code IDE-themed interface for GitHub OAuth login, role selection, real-time FIFO matching, WebSocket chat, and sprint completion with AI code review.

**Last Updated:** 2026-02-21

---

## Features

- **GitHub OAuth2 Login** — Session-cookie based authentication (JSESSIONID), no JWT
- **Role Selection** — Choose Frontend Developer or Backend Developer
- **Protected Routing** — Automatic redirect guards (unauthenticated → Login, no role → RoleSelect, role set → Dashboard)
- **VS Code IDE Dashboard** — File explorer sidebar, editor area, terminal panel layout
- **FIFO Developer Matching** — Live terminal log updates while waiting in queue
- **Real-time WebSocket Chat** — STOMP via `@stomp/stompjs`
  - Persistent message history fetched via REST on reconnect
  - Exponential backoff reconnect (up to 5 attempts)
  - Message deduplication by ID
- **Edit Profile** — Name, bio, and skill tag selection (`SkillSelector`)
- **Project Preferences** — Theme multi-select (`ThemeSelector`), difficulty, learning goal (`MatchPreferencesModal`)
- **Sprint Completion** — Modal with optional repo URL submission (`CompleteSprintModal`)
- **AI Sprint Review Score** — Displays Groq-generated score (0–100) after sprint completion
- **Session Persistence** — Active match state restored on page refresh via `/api/users/me/status`
- **Error Boundary** — Graceful error handling with fallback UI
- **Toast Notifications** — User feedback via React Hot Toast
- **Binary Background Animation** — Animated binary rain on entry screens

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool & dev server |
| React Router DOM | 7.12.0 | Client-side routing |
| Axios | 1.13.2 | HTTP client |
| @stomp/stompjs | 7.1.1 | WebSocket / STOMP client |
| Tailwind CSS | 4.1.18 | Utility-first styling |
| React Hot Toast | 2.6.0 | Toast notifications |
| Vitest | 4.0.18 | Unit test runner |
| React Testing Library | 16.3.2 | Component testing |

---

## Project Structure

```
sprint-mate-frontend/
├── public/
├── src/
│   ├── __tests__/
│   │   ├── Dashboard.test.tsx          # Dashboard states (IDLE/WAITING/MATCHED)
│   │   ├── Login.test.tsx              # Login render and OAuth redirect
│   │   └── RoleSelect.test.tsx         # Role selection flow
│   ├── components/
│   │   ├── BinaryBackground.tsx        # Animated binary rain background
│   │   ├── ChatPanel.tsx               # Real-time STOMP chat UI
│   │   ├── CompleteSprintModal.tsx     # Sprint completion modal (repo URL input)
│   │   ├── EditProfileModal.tsx        # Profile edit (name, bio, skills)
│   │   ├── ErrorBoundary.tsx           # React error boundary wrapper
│   │   ├── IdeLayout.tsx               # VS Code style layout shell
│   │   ├── MatchPreferencesModal.tsx   # Theme / difficulty / learning goal picker
│   │   ├── ProtectedRoute.tsx          # Auth + optional role guard HOC
│   │   ├── SkillSelector.tsx           # Multi-select skill tag input
│   │   ├── TerminalPanel.tsx           # Terminal-style status log with typewriter
│   │   ├── ThemeSelector.tsx           # Project theme multi-select
│   │   └── index.ts                    # Barrel exports
│   ├── contexts/
│   │   ├── AuthContext.tsx             # user, activeMatch, isAuthenticated, refreshStatus
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useChat.ts                  # STOMP WebSocket + history + reconnect logic
│   │   └── index.ts
│   ├── pages/
│   │   ├── Dashboard.tsx               # Main IDE dashboard page
│   │   ├── Login.tsx                   # GitHub OAuth entry point
│   │   ├── NotFound.tsx                # 404 page
│   │   ├── RoleSelect.tsx              # Role selection after first login
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts                      # Axios instance (withCredentials + interceptors)
│   │   ├── authService.ts              # OAuth redirect helpers + logout
│   │   ├── chatService.ts              # GET /api/chat/history/{matchId}
│   │   ├── matchService.ts             # Match CRUD API calls
│   │   ├── themeService.ts             # GET /api/projects (themes/archetypes)
│   │   ├── userService.ts              # User profile + preferences API calls
│   │   └── index.ts
│   ├── test/
│   │   └── setup.ts                    # Vitest setup (@testing-library/jest-dom)
│   ├── utils/
│   │   ├── logger.ts                   # Structured console logger
│   │   └── index.ts
│   ├── types.ts                        # All TypeScript interfaces
│   ├── App.tsx                         # Router setup + AuthProvider
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles + Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
└── eslint.config.js
```

---

## Component Hierarchy

```
COMPONENT HIERARCHY
====================

App (main.tsx)
├── ErrorBoundary
└── BrowserRouter
    └── AuthProvider (AuthContext)
        ├── Toaster (react-hot-toast)
        └── Routes
            ├── /login        → Login
            │                     └── BinaryBackground
            │
            ├── /role-select  → RoleSelectRoute → RoleSelect
            │                                       └── BinaryBackground
            │
            ├── /dashboard    → ProtectedRoute(requireRole) → Dashboard
            │                           ├── IdeLayout
            │                           │   ├── BinaryBackground (subtle)
            │                           │   ├── [Explorer panel — file tree]
            │                           │   ├── [Editor area — project description]
            │                           │   └── TerminalPanel
            │                           │
            │                           ├── ChatPanel
            │                           │   └── useChat (hook)
            │                           │       ├── STOMP Client (@stomp/stompjs)
            │                           │       └── chatService.getChatHistory()
            │                           │
            │                           ├── EditProfileModal
            │                           │   ├── SkillSelector
            │                           │   └── ThemeSelector
            │                           │
            │                           ├── MatchPreferencesModal
            │                           │   └── ThemeSelector
            │                           │
            │                           └── CompleteSprintModal
            │
            └── *             → NotFound
```

---

## Authentication Flow

```
GITHUB OAUTH2 AUTHENTICATION FLOW
===================================

Browser          Frontend (React)     Backend (Spring)       GitHub
   |                   |                    |                    |
   | click Login       |                    |                    |
   |------------------>|                    |                    |
   |                   | authService        |                    |
   |                   | .initiateLogin()   |                    |
   |<------------------| redirect to        |                    |
   |   /oauth2/authorization/github         |                    |
   |-------------------------------------->|                    |
   |                                        | 302 redirect to    |
   |<---------------------------------------| github.com/login   |
   |                                                             |
   | user logs in and authorizes app                            |
   |------------------------------------------------------------>|
   |                                                             |
   |<-- redirect to /login/oauth2/code/github?code=xxx ---------|
   |-------------------------------------->|                    |
   |                                        | exchange code      |
   |                                        |------------------>|
   |                                        |<---- token --------|
   |                                        |                    |
   |                                        | CustomOAuth2       |
   |                                        | UserService:       |
   |                                        | upsert user in DB  |
   |                                        |                    |
   |<------- Set-Cookie: JSESSIONID --------|                    |
   |         302 redirect to /dashboard     |                    |
   |                   |                    |                    |
   | App.tsx mounts    |                    |                    |
   |------------------>|                    |                    |
   |                   | AuthContext        |                    |
   |                   | fetchStatus()      |                    |
   |                   | GET /api/users/me/status               |
   |                   |------------------->|                    |
   |                   |<-- UserStatusResponse + activeMatch ----|
   |                   |                    |                    |
   |                   | route to           |                    |
   |                   | /role-select       |                    |
   |                   | or /dashboard      |                    |
```

---

## WebSocket Chat Flow

```
WEBSOCKET CHAT FLOW (STOMP over WebSocket)
===========================================

 Browser (useChat hook)              Backend (ChatController)
         |                                       |
         | WS upgrade to /ws                     |
         |-------------------------------------->|
         |<------- WS 101 Switching Protocols ---|
         |                                       |
         | STOMP CONNECT                         |
         |-------------------------------------->| WebSocketSecurityConfig
         |                                       | validates JSESSIONID session
         |<------- STOMP CONNECTED --------------|
         |                                       |
         | SUBSCRIBE /topic/match/{matchId}      |
         |-------------------------------------->|
         |                                       |
         | Send STOMP frame to /app/chat.send    |
         | { matchId, content }                  |
         |-------------------------------------->|
         |                                       | ChatService.saveMessage()
         |                                       | - validate participant
         |                                       | - sanitize content (XSS)
         |                                       | - save to chat_messages
         |                                       |
         |<-- broadcast to /topic/match/{matchId}|
         | { id, matchId, senderId,              |
         |   senderName, content, createdAt }    |
         |                                       |
         | (Both partners receive the message)   |

  On reconnect / page refresh:
  useChat hook → chatService.getChatHistory(matchId)
  → GET /api/chat/history/{matchId}
  → deduplicates received messages by ID
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/oauth2/authorization/github` | Initiate GitHub OAuth login |
| GET | `/api/auth/logout` | Logout and invalidate session |
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/users/me/status` | Get user status with active match info |
| PATCH | `/api/users/me/role` | Set role (FRONTEND / BACKEND) |
| PUT | `/api/users/me` | Update profile (name, bio, skills) |
| PUT | `/api/users/me/preferences` | Update project preferences |
| POST | `/api/matches/find?topic=xxx` | Find match or join FIFO queue |
| DELETE | `/api/matches/queue` | Leave the waiting queue |
| POST | `/api/matches/{matchId}/complete` | Complete a sprint |
| GET | `/api/projects` | List project templates |
| GET | `/api/chat/history/{matchId}` | Get chat message history |
| WS | `/ws` | WebSocket endpoint (STOMP) |

---

## Installation & Running

### Prerequisites
- Node.js 18+
- npm
- Spring Boot backend running at `http://localhost:8080`

### Steps

```bash
git clone https://github.com/mahmutsyilmz/sprint-mate-frontend.git
cd sprint-mate-frontend

npm install

# Start development server
npm run dev       # http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Testing

```bash
# Run all tests (watch mode)
npm test

# Run once (CI mode)
npm test -- --run
```

Test files (Vitest 4 + React Testing Library 16 + jsdom):

| File | Coverage |
|---|---|
| `src/__tests__/Login.test.tsx` | Login render, GitHub OAuth redirect |
| `src/__tests__/RoleSelect.test.tsx` | Role selection flow, API call |
| `src/__tests__/Dashboard.test.tsx` | IDLE / WAITING / MATCHED states |

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Backend API URL (with /api prefix)
VITE_API_BASE_URL=http://localhost:8080/api

# Backend base URL (for OAuth redirects, without /api)
VITE_BACKEND_URL=http://localhost:8080
```

> All variables are optional — defaults are set to `localhost:8080`. The Vite dev server proxies `/ws`, `/api`, and `/oauth2` to the backend to preserve session cookies.

---

## Styling

VS Code-inspired dark theme via Tailwind CSS custom properties:

```css
--ide-bg:        #1e1e1e   /* Editor background */
--ide-sidebar:   #252526   /* Sidebar / panel background */
--ide-border:    #3e3e42   /* Borders */
--ide-blue:      #007acc   /* Status bar accent */
--primary:       #4ade80   /* Green accent (matching / success) */
--syntax-blue:   #569cd6   /* Code syntax blue */
--syntax-purple: #c586c0   /* Code syntax purple */
--syntax-yellow: #dcdcaa   /* Code syntax yellow */
--syntax-gray:   #858585   /* Comments / muted text */
```

---

## Related Projects

- [Sprint Mate Backend](https://github.com/mahmutsyilmz/sprint-mate-backend) — Spring Boot 3 + Java 17 backend API

---

## Developer

**Mahmut Sami Yılmaz** — [@mahmutsyilmz](https://github.com/mahmutsyilmz)

---

## License

Private project — All rights reserved.
