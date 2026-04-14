import sys
import os

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app  # noqa: F401 — Vercel이 'app' 변수를 ASGI 핸들러로 감지
from mangum import Mangum

# Vercel 서버리스 핸들러 (ASGI → ASGI bridge)
handler = Mangum(app, lifespan="off")
