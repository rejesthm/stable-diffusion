"""
Launch script for the API-only backend.
Runs from project root. Use: python backend/launch.py
Or with args: python backend/launch.py --port 7861 --listen
"""

import os
import sys

# Ensure we run from project root (parent of backend/)
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
for p in (project_root, backend_dir):
    if p not in sys.path:
        sys.path.insert(0, p)
os.chdir(project_root)

# Add --nowebui so existing launch logic treats this as API-only
if "--nowebui" not in sys.argv:
    sys.argv.append("--nowebui")

# Import and run launch preparation, then start backend
from modules import launch_utils
from modules import timer

launch_utils.startup_timer.record("launcher")

# Run prepare_environment (installs deps, etc.)
with launch_utils.startup_timer.subcategory("prepare environment"):
    if not launch_utils.args.skip_prepare_environment:
        launch_utils.prepare_environment()

if __name__ == "__main__":
    from backend.main import run
    run()
