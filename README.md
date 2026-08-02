# ChatGPT Clone

A full-stack ChatGPT clone built with React (Vite) on the frontend and Node.js/Express on the backend, using Google Gemini AI for chat responses.

## Tech Stack

- **Frontend:** React 19, Vite, Axios, React Markdown, Lucide Icons
- **Backend:** Node.js, Express, MySQL2, Google Gemini AI
- **Database:** MySQL

## Project Structure

```
chatgpt-clone/
├── backend/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── controller/chat.controller.js   # Request handlers
│   │   │   ├── service/chat.service.js          # Business logic & Gemini AI
│   │   │   └── chat.routes.js                   # Route definitions
│   │   └── main.routes.js                       # Root API router
│   ├── db/
│   │   ├── db.config.js                         # MySQL connection pool
│   │   └── schema.sql                           # Database schema
│   ├── middleware/error-handler.js               # Centralized error handling
│   ├── .env.example                             # Environment variable template
│   ├── app.js                                   # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader/                      # Top navigation bar
│   │   │   ├── ChatInput/                       # Message input area
│   │   │   ├── ChatMessage/                     # Single message bubble
│   │   │   ├── MessageList/                     # Scrollable message list
│   │   │   └── Sidebar/                         # Left sidebar navigation
│   │   ├── App.jsx                              # Main app component
│   │   ├── App.css                              # Global styles
│   │   └── main.jsx                             # React entry point
│   ├── .env.example                             # Frontend env template
│   ├── index.html                               # HTML shell
│   ├── vite.config.js                           # Vite config with API proxy
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- Google Gemini API key

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd chatgpt-clone
```

### 2. Database Setup

```sql
-- Create the database
CREATE DATABASE chatgpt_clone;

-- Create the user (optional)
CREATE USER 'chat'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON chatgpt_clone.* TO 'chat'@'localhost';
FLUSH PRIVILEGES;

-- Run the schema
USE chatgpt_clone;
SOURCE backend/db/schema.sql;
```

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database and API credentials
npm install
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform (Render, Railway, Vercel, etc.):
   - `PORT` — Server port (default: 5000)
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — MySQL connection
   - `GEMINI_API_KEY` — Google Gemini API key
   - `GEMINI_MODEL` — Gemini model (default: gemini-2.0-flash)

2. Start command: `npm start` (runs `node app.js`)

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to a static host (Vercel, Netlify, Cloudflare Pages, etc.)

3. Set environment variable:
   - `VITE_API_URL` — Your deployed backend URL (e.g., `https://your-backend.onrender.com/api`)
   - If the frontend and backend share the same domain, leave it as `/api`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/conversations` | Fetch recent conversations |
| POST | `/api/chat/conversations` | Send a new message |

## Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `DB_HOST` | MySQL host | Yes |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | MySQL database name | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GEMINI_MODEL` | Gemini model name | No (default: gemini-2.0-flash) |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (default: `/api`) |

## License

MIT
