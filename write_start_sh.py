if __name__ == "__main__":
    sh = """
#!/usr/bin/bash

# Navigate to the directory where routers.py is located and start the first FastAPI app (on port 8000)
cd $HOME/sqlite_server
uvicorn routers:router --host 0.0.0.0 --port 8000 &

# Navigate to the directory where main.py is located and start the second FastAPI app (on port 8001)
cd $HOME
uvicorn main:app --host 0.0.0.0 --port 8001

    """
    with open("start.sh", "w") as f:
        f.write(sh)
