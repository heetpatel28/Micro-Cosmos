from fastapi import FastAPI
import uvicorn
import os

app = FastAPI(title="{{SERVICE_NAME}}")

@app.get("/")
def read_root():
    return {"message": "Welcome to {{SERVICE_NAME}} running on Python {{VERSION}}"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", {{PORT}}))
    uvicorn.run(app, host="0.0.0.0", port=port)
