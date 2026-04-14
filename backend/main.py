from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

from dotenv import load_dotenv
load_dotenv()

from backend.routers import upload, expenses, summary

app = FastAPI(title="영수증 지출 관리 API", version="1.0.0")

# 로컬(localhost:*)과 Vercel 프로덕션 도메인 모두 허용
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(?:localhost:\d+|[\w-]+\.vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel 서버리스는 /tmp 만 쓰기 가능, 로컬은 backend/uploads 사용
IS_VERCEL = os.getenv("VERCEL") == "1"
uploads_dir = Path("/tmp/uploads") if IS_VERCEL else Path("backend/uploads")
uploads_dir.mkdir(parents=True, exist_ok=True)

app.include_router(upload.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(summary.router, prefix="/api")

# 업로드 이미지 정적 서빙 (GET /uploads/filename)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.get("/")
def root():
    return {"message": "영수증 지출 관리 API가 정상 동작 중입니다."}
