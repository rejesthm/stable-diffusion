# Stable Diffusion WebUI - Backend + React Frontend

This project has been refactored to support a separated backend (Python FastAPI) and frontend (React + Vite + Tailwind).

## Architecture

- **Backend**: Python FastAPI server exposing `/sdapi/v1/*` REST API
- **Frontend**: React SPA with Vite and Tailwind CSS
- **Communication**: REST/JSON over HTTP; images as base64

## Running the Application

### Option 1: Backend + React (new architecture)

1. **Start the backend** (from project root):
   ```bash
   python launch.py --backend
   ```
   Or:
   ```bash
   python backend/launch.py
   ```
   Backend runs on http://localhost:7861 by default.

2. **Start the frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on http://localhost:5173.

3. Open http://localhost:5173 in your browser. The Vite dev server proxies API requests to the backend.

### Option 2: Legacy Gradio UI

```bash
python launch.py
```

Runs the original Gradio-based UI. Add `--api` to also expose the REST API.

## API Endpoints

| Path | Purpose |
|------|---------|
| `/sdapi/v1/txt2img` | Text-to-image generation |
| `/sdapi/v1/img2img` | Image-to-image generation |
| `/sdapi/v1/extra-single-image` | Upscale, face restore |
| `/sdapi/v1/samplers`, `/sdapi/v1/sd-models`, etc. | Model/sampler lists |
| `/internal/progress` | Progress polling |
| `/sd_extra_networks/*` | Thumbnails, metadata |

## Production

- **Backend**: `python launch.py --backend --listen` (or set port via `--port`)
- **Frontend**: `cd frontend && npm run build` then serve the `dist/` folder
- Set `VITE_API_URL` to your backend URL when building the frontend for production.
