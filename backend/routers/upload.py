from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import os
import uuid

from backend.services.ocr_service import parse_receipt
from backend.services.storage_service import append_expense

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10MB
IS_VERCEL = os.getenv("VERCEL") == "1"
UPLOAD_DIR = Path("/tmp/uploads") if IS_VERCEL else Path("backend/uploads")


@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    # 1. MIME 타입 검증
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식입니다. JPG, PNG, PDF만 허용됩니다. (받은 타입: {file.content_type})",
        )

    # 2. 파일 크기 검증
    file_bytes = await file.read()
    if len(file_bytes) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail="파일 크기가 10MB를 초과합니다.",
        )

    # 3. uploads/ 에 원본 파일 저장
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename).suffix
    saved_filename = f"{uuid.uuid4()}{suffix}"
    saved_path = UPLOAD_DIR / saved_filename
    saved_path.write_bytes(file_bytes)

    # 4. OCR 파싱
    try:
        parsed = parse_receipt(file_bytes, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR 파싱 실패: {str(e)}")

    # 5. 저장 경로 기록 후 expenses.json에 저장
    parsed["raw_image_path"] = f"uploads/{saved_filename}"
    expense = append_expense(parsed)

    return expense
