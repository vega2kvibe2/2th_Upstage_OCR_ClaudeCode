from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

from dotenv import load_dotenv
load_dotenv()

from backend.routers import upload, expenses, summary

app = FastAPI(title="영수증 지출 관리 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# uploads 디렉토리 자동 생성
uploads_dir = Path("backend/uploads")
uploads_dir.mkdir(parents=True, exist_ok=True)

app.include_router(upload.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(summary.router, prefix="/api")

# 업로드 이미지 정적 서빙 (GET /uploads/filename)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.get("/")
def root():
    return {"message": "영수증 지출 관리 API가 정상 동작 중입니다."}
