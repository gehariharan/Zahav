import requests
import subprocess
import time
import sys
import os

def check_server_running():
    """Check if the FastAPI server is running."""
    try:
        response = requests.get("http://localhost:8000/")
        return response.status_code == 200
    except requests.ConnectionError:
        return False

def start_server():
    """Start the FastAPI server."""
    print("Starting the FastAPI server...")
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Start the server in a new process
    process = subprocess.Popen(
        ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
        cwd=script_dir
    )
    
    # Wait for the server to start
    for _ in range(10):
        time.sleep(1)
        if check_server_running():
            print("Server started successfully!")
            return True
    
    print("Failed to start the server.")
    return False

if __name__ == "__main__":
    if check_server_running():
        print("FastAPI server is already running.")
    else:
        if start_server():
            print("Server is now running at http://localhost:8000")
        else:
            print("Could not start the server. Please check for errors.")
            sys.exit(1)
