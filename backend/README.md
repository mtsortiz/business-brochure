# 🚀 Brochure Generator API (FastAPI Backend)

Backend API for the Business Brochure Generator web application.

## Setup

```bash
cd backend
uv sync
```

## Environment Variables

Create a `.env` file:
```env
GEMINI_API_KEY=your_key_here
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

## Run

```bash
uv run python main.py
```

Server runs on `http://localhost:8000`

## API Endpoints

### Health Check
`GET /health` - Check if API is running

### Generate Brochure (Non-streaming)
`POST /api/generate-brochure`
```json
{
  "company_name": "Company Name",
  "url": "https://company.com"
}
```

### Generate Brochure (Streaming)
`POST /api/generate-brochure-stream`

Returns Server-Sent Events stream for real-time updates.

## Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
