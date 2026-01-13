# 🌐 Business Brochure Generator - Full Stack App

Complete web application for generating AI-powered company brochures. Built with Next.js (frontend) and FastAPI (backend).

## 📋 Project Structure

```
business-brochure-app/
├── frontend/              # Next.js React app
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   └── components/   # React components
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── README.md
│
├── backend/               # FastAPI Python backend
│   ├── main.py           # FastAPI application
│   ├── scraper.py        # Web scraping utilities
│   ├── pyproject.toml
│   ├── .env.example
│   └── README.md
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Google Gemini API key
- [uv](https://github.com/astral-sh/uv) (recommended for Python)

### 1. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
# GEMINI_API_KEY=your_key_here

# Install dependencies
uv sync

# Run the server
uv run python main.py
```

Backend runs on **http://localhost:8000**

API docs available at: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.local.example .env.local

# Edit if needed (default points to localhost:8000)

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on **http://localhost:3000**

## 🔄 Architecture

```
User Browser (http://localhost:3000)
     ↓
Next.js Frontend
     ↓ HTTP POST
FastAPI Backend (http://localhost:8000)
     ↓
Web Scraper (BeautifulSoup)
     ↓
Google Gemini API
     ↓
AI-Generated Brochure
     ↓ SSE Stream (optional)
Frontend Display
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Generate Brochure (Non-streaming)
```bash
POST /api/generate-brochure

Request:
{
  "company_name": "OpenAI",
  "url": "https://openai.com"
}

Response:
{
  "status": "success",
  "brochure": "# OpenAI\n\n..."
}
```

### Generate Brochure (Streaming)
```bash
POST /api/generate-brochure-stream

Response: Server-Sent Events stream
data: {"content": "text chunk"}
data: {"content": "more text"}
data: [DONE]
```

## 🎯 Features

- ✅ **Web Scraping** - Automatically crawls company websites
- ✅ **AI Link Selection** - Identifies relevant pages using Gemini
- ✅ **Content Aggregation** - Gathers info from multiple pages
- ✅ **Brochure Generation** - Creates professional marketing copy
- ✅ **Real-time Streaming** - Watch brochure generate live
- ✅ **Responsive UI** - Beautiful Tailwind CSS design
- ✅ **Error Handling** - Graceful error messages
- ✅ **CORS Support** - Cross-origin requests enabled

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **TypeScript** - Type safety

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **BeautifulSoup4** - HTML parsing
- **OpenAI SDK** - Gemini API integration
- **Pydantic** - Data validation

## 📝 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_api_key_here
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🎨 UI Components

### BrochureForm
Input form for company name and URL, with streaming toggle.

### BrochureDisplay
Renders markdown brochure content with proper formatting.

## 🔐 Security Notes

- API keys stored in `.env` files (added to `.gitignore`)
- CORS configured for localhost development
- Input validation on both frontend and backend
- Error messages don't expose sensitive information

## 📦 Production Deployment

### Backend (Docker)
```dockerfile
FROM python:3.11
WORKDIR /app
COPY backend .
RUN pip install uv && uv sync --frozen
CMD ["uv", "run", "python", "main.py"]
```

### Frontend (Vercel/Netlify)
```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### "Connection refused" error
- Make sure both backend and frontend servers are running
- Check `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local`

### "GEMINI_API_KEY not found"
- Verify `.env` file in backend directory
- Ensure key is valid in Google AI Studio

### CORS errors
- Check that CORS middleware is configured correctly in `main.py`
- Ensure frontend URL is in the `allow_origins` list

### Slow scraping
- Some websites may be slow to load
- Check internet connection
- Try with a different website

## 📚 Documentation

- [Backend README](./backend/README.md) - API documentation
- [Frontend README](./frontend/README.md) - UI documentation
- [FastAPI Docs](http://localhost:8000/docs) - Interactive API explorer

## 🤝 Development Workflow

1. Make changes to frontend or backend
2. Frontend auto-reloads on save (Next.js dev server)
3. Backend auto-reloads on save (if using `uvicorn --reload`)
4. Test with browser console and API documentation

## 📊 Example Usage

1. Open http://localhost:3000
2. Enter company name: "HuggingFace"
3. Enter URL: "https://huggingface.co"
4. Check "Stream response" for live generation
5. Click "Generate Brochure"
6. Watch the brochure appear in real-time!

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [BeautifulSoup Docs](https://www.crummy.com/software/BeautifulSoup/)

## 📄 License

Open source - feel free to use and modify