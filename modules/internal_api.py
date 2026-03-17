"""
Internal API routes for the React frontend.
Extracted from ui.setup_ui_api to avoid Gradio UI dependency when running API-only backend.
"""

import datetime
import os

from pydantic import BaseModel, Field


class QuicksettingsHint(BaseModel):
    name: str = Field(title="Name of the quicksettings field")
    label: str = Field(title="Label of the quicksettings field")


def setup_internal_api(app):
    """Register internal API routes used by the React frontend."""
    from modules.shared import opts
    from modules import timer, sysinfo
    from modules import launch_utils

    def quicksettings_hint():
        return [QuicksettingsHint(name=k, label=v.label) for k, v in opts.data_labels.items()]

    app.add_api_route("/internal/quicksettings-hint", quicksettings_hint, methods=["GET"], response_model=list[QuicksettingsHint])
    app.add_api_route("/internal/ping", lambda: {}, methods=["GET"])
    app.add_api_route("/internal/profile-startup", lambda: timer.startup_record, methods=["GET"])

    def download_sysinfo(attachment=False):
        from fastapi.responses import PlainTextResponse

        text = sysinfo.get()
        filename = f"sysinfo-{datetime.datetime.utcnow().strftime('%Y-%m-%d-%H-%M')}.json"
        return PlainTextResponse(text, headers={'Content-Disposition': f'{"attachment" if attachment else "inline"}; filename="{filename}"'})

    app.add_api_route("/internal/sysinfo", download_sysinfo, methods=["GET"])
    app.add_api_route("/internal/sysinfo-download", lambda: download_sysinfo(attachment=True), methods=["GET"])

    # Mount webui-assets only if the directory exists (for fonts, etc.)
    assets_dir = launch_utils.repo_dir('stable-diffusion-webui-assets')
    if os.path.isdir(assets_dir):
        import fastapi.staticfiles
        app.mount("/webui-assets", fastapi.staticfiles.StaticFiles(directory=assets_dir), name="webui-assets")
