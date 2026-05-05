# ToDo App 1.57

A simple ToDo application with an Express backend and vanilla JavaScript frontend.

## Setup

```bash
npm install
npm start
```

The server runs on port 3000 by default (or PORT env var).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task `{ "title": "..." }` |
| PATCH | `/api/tasks/:id` | Update task `{ "completed": true/false }` |
| DELETE | `/api/tasks/:id` | Delete a task |

### Response Examples

**POST /api/tasks**
```json
{
  "id": "1746456789012",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2025-05-05T18:30:00.000Z"
}
```

**GET /api/tasks**
```json
[
  {
    "id": "1746456789012",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2025-05-05T18:30:00.000Z"
  }
]
```

## Frontend

Open `public/index.html` in a browser, or serve statically:

```bash
npx serve public
```

The frontend gracefully falls back to localStorage if the API is unavailable.

## Tech Stack

- Node.js
- Express
- CORS
- Vanilla JavaScript (no framework)
