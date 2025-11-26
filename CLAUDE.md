# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fluxion00Web is a chat interface for AI Agents powered by the Fluxion00 API. This Next.js application enables real-time conversations with LLM agents that have database query capabilities via WebSocket connections. Users can authenticate through News Nexus Portal or directly login, and interact with agents that can query article data and execute custom SQL.

## Key Commands

### Development
```bash
npm run dev          # Start development server on port 3001
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 15.5.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit with redux-persist
- **Real-time**: WebSockets for chat communication

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group (with sidebar)
│   │   └── home/                # Main chat page (future)
│   └── (full-width)/(auth)/     # Auth layout group (no sidebar)
│       └── login/               # Login page
├── components/
│   ├── auth/                    # Authentication components
│   ├── common/                  # Shared components
│   ├── form/                    # Form inputs and elements
│   └── ui/                      # UI components (buttons, alerts, etc)
├── context/                     # React contexts (Theme, Sidebar)
├── icons/                       # SVG icons (processed by @svgr/webpack)
├── layout/                      # Layout components (AppHeader, AppSidebar, etc)
└── store/                       # Redux store configuration
    └── features/user/           # User authentication slice
```

### Authentication Flow

1. **Login**: User submits credentials to `NEXT_PUBLIC_API_BASE_URL_FOR_LOGIN` (News Nexus API)
2. **JWT Token**: News Nexus API returns JWT token signed with shared `JWT_SECRET`
3. **Redux Persist**: Token and user data stored in `localStorage` via `redux-persist`
4. **WebSocket Auth**: Token passed as query parameter when connecting to Fluxion00 API
5. **Cross-App**: Users already logged into News Nexus Portal can pass token directly

**Important**: Fluxion00 API and News Nexus API share the same `JWT_SECRET` for token verification.

### State Management

- **Redux Store**: Configured in `src/store/index.ts`
- **User Slice**: `src/store/features/user/userSlice.ts` manages authentication state
  - `loginUser`: Store token and user data
  - `logoutUser`: Clear token and user data
  - `logoutUserFully`: Complete logout including admin status
- **Persistence**: Only `user` slice is persisted to `localStorage`
- **Typed Hooks**: Use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts`

### WebSocket Communication

The app will communicate with Fluxion00 API via WebSocket at `/ws/{client_id}?token={jwt_token}`:

**Connection Pattern**:
```javascript
const clientId = crypto.randomUUID();
const token = userReducer.token;
const ws = new WebSocket(`${NEXT_PUBLIC_API_BASE_URL}/ws/${clientId}?token=${token}`);
```

**Message Types (Client → Server)**:
- `user_message`: Send user message to agent
- `clear_history`: Clear conversation history
- `ping`: Keep-alive

**Message Types (Server → Client)**:
- `system`: Connection status and notifications
- `user_echo`: Acknowledgement of user message
- `typing`: Agent processing indicator (true/false)
- `agent_message`: Agent response
- `error`: Error messages

### Environment Variables

Required variables in `.env`:
```
NEXT_PUBLIC_API_BASE_URL              # Fluxion00 API (WebSocket, default: http://localhost:8000)
NEXT_PUBLIC_API_BASE_URL_FOR_LOGIN    # News Nexus API for authentication
NEXT_PUBLIC_APP_NAME                  # Application name
NEXT_PUBLIC_MODE                      # workstation/dev (enables auto-fill in workstation mode)
```

### SVG Handling

SVGs are processed as React components via `@svgr/webpack` (configured in `next.config.ts`):
```tsx
import { EyeIcon } from "@/icons";
<EyeIcon className="fill-gray-500" />
```

### Styling

- **Framework**: Tailwind CSS 4 with PostCSS
- **Dark Mode**: Managed via `ThemeContext` (src/context/ThemeContext.tsx)
- **Responsive**: Mobile-first design (application viewable on desktop and mobile)
- **Style Reference**: Match NewsNexus Portal styling patterns

### Route Groups

- `(dashboard)`: Pages with sidebar layout (AppSidebar, AppHeader)
- `(full-width)/(auth)`: Full-width pages without sidebar (login)

### API Reference

Full Fluxion00 API documentation is in `docs/API_REFERENCE.md`. Key endpoints:
- `GET /health`: Health check
- `GET /api/info`: API metadata and available agent tools
- `WebSocket /ws/{client_id}`: Real-time chat with authentication

### Agent Tools

The AI agent has access to database query tools:
- `count_approved_articles`: Count articles by status
- `search_approved_articles`: Full-text search across articles
- `get_articles_by_user`: Filter by user
- `get_articles_by_date_range`: Filter by date
- `get_article_by_id`: Get specific article
- `list_approved_articles`: Paginated article list
- `execute_custom_sql`: Text-to-SQL fallback (read-only, validated)

## Development Notes

### Current Implementation Status
- ✅ Login authentication with News Nexus API
- ✅ Redux state management with persistence
- ✅ Dark mode theme support
- ✅ Responsive sidebar navigation
- ⏳ Chat interface (planned for /home page)
- ⏳ WebSocket integration (planned)
- ⏳ Agent status/action logs (API not yet supported)

### Important Conventions
- Use `@/` path alias for imports from `src/`
- Maintain route group structure for layouts
- All client components must have `"use client"` directive
- Match NewsNexus Portal design patterns for consistency
