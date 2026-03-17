# Stable Diffusion WebUI

A web interface for Stable Diffusion with a Python backend and React frontend.

## Quick Start

**1. Start the backend**
```bash
python launch.py --backend
```
Backend runs at http://localhost:7861

**2. Start the frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

**3. Open** http://localhost:5173 in your browser.

## Requirements

- Python 3.10+
- Node.js 18+
- GPU with CUDA (recommended) or CPU

## Project Structure

| Folder | Purpose |
|--------|---------|
| `backend/` | FastAPI server, REST API, modules, scripts, extensions |
| `frontend/` | React + Vite + Tailwind UI |
| `docs/` | Documentation |
| `configs/` | Model configs (v1-inference, etc.) |

## Legacy Gradio UI

To run the original Gradio interface:
```bash
python launch.py
```

## Documentation

- [Generation Parameters](docs/PARAMETERS.md) – Steps, CFG Scale, Sampler, Seed, and more
