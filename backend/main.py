"""
FastAPI-only backend for Stable Diffusion WebUI.
Serves REST API for the React frontend. Run via backend/launch.py.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from modules import initialize_util
from modules.shared_cmd_options import cmd_opts


def create_app():
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Stable Diffusion API",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS for React frontend (Vite default port 5173)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    initialize_util.setup_middleware(app)

    # SD API routes
    from modules.api.api import Api
    from modules.call_queue import queue_lock

    api = Api(app, queue_lock)

    # Progress API (for generation progress polling)
    from modules import progress
    progress.setup_progress_api(app)

    # Internal API (ping, quicksettings, sysinfo)
    from modules import internal_api
    internal_api.setup_internal_api(app)

    # Extra networks (thumbnails, metadata for LoRA, etc.)
    from modules import ui_extra_networks
    ui_extra_networks.add_pages_to_demo(app)

    return app, api


def run():
    """Initialize and run the backend server."""
    from modules import timer, initialize, script_callbacks

    initialize.imports()
    initialize.check_versions()
    initialize.initialize()

    app, api = create_app()

    script_callbacks.before_ui_callback()
    script_callbacks.app_started_callback(None, app)

    print(f"Startup time: {timer.startup_timer.summary()}.")
    print("Backend API server starting. Use the React frontend at http://localhost:5173")

    api.launch(
        server_name=initialize_util.gradio_server_name(),
        port=cmd_opts.port if cmd_opts.port else 7861,
        root_path=f"/{cmd_opts.subpath}" if cmd_opts.subpath else ""
    )
