from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# ──────────────────────────────────────────────
# React SPA 서빙
#   Vercel 서버리스에서 정적 파일 라우팅이 Python
#   함수보다 우선하지 않는 문제를 FastAPI 내부에서 처리
# ──────────────────────────────────────────────
# api/index.py 기준: parent(api/) → parent(프로젝트 루트)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
_DIST_DIR = _PROJECT_ROOT / "frontend" / "dist"


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """
    1) dist/ 내 실제 파일이면 그대로 서빙 (JS·CSS·이미지 등)
    2) 그 외(React Router 경로)는 index.html 반환
    """
    if full_path:
        candidate = (_DIST_DIR / full_path).resolve()
        # 경로 탈출 방지
        if candidate.is_relative_to(_DIST_DIR.resolve()) and candidate.is_file():
            return FileResponse(str(candidate))

    index_html = _DIST_DIR / "index.html"
    if index_html.exists():
        return FileResponse(str(index_html))

    # 빌드 파일 없음 — 디버그용
    return {
        "error": "frontend not built",
        "dist_dir": str(_DIST_DIR),
        "exists": _DIST_DIR.exists(),
    }
