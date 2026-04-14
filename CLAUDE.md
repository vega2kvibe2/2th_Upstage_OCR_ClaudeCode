# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

영수증(JPG/PNG/PDF)을 업로드하면 **Upstage Vision LLM**이 자동으로 파싱하여 지출 데이터를 구조화하는 경량 웹 애플리케이션.
DB 없이 `expenses.json` 파일 기반으로 운영하며, FastAPI(백엔드) + React+Vite(프론트엔드) 구조.

---

## 개발 명령어

### 백엔드 (FastAPI)

```bash
# 가상환경 생성 및 활성화
python -m venv venv
source venv/Scripts/activate      # Windows
source venv/bin/activate           # macOS/Linux

# 패키지 설치
pip install -r backend/requirements.txt

# 개발 서버 실행 (루트에서)
uvicorn backend.main:app --reload --port 8000

# API 문서 확인
# http://localhost:8000/docs
```

### 프론트엔드 (React + Vite)

```bash
cd frontend
npm install
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기
```

### OCR 단독 테스트

```bash
# 영수증 파싱 API 직접 호출
curl -X POST http://localhost:8000/api/upload \
  -F "file=@images/01_emart.png"

# 지출 목록 조회
curl http://localhost:8000/api/expenses

# 월별 통계 조회
curl "http://localhost:8000/api/summary?month=2025-07"
```

### 환경변수 설정

```bash
# backend/.env
UPSTAGE_API_KEY=your_key_here
DATA_FILE_PATH=backend/data/expenses.json

# frontend/.env.local
VITE_API_BASE_URL=http://localhost:8000
```

---

## 아키텍처

### 디렉토리 구조

```
claude_ocr_1day/
├── backend/
│   ├── main.py                  # FastAPI 앱, CORS, 라우터 등록
│   ├── routers/
│   │   ├── upload.py            # POST /api/upload
│   │   ├── expenses.py          # GET, DELETE, PUT /api/expenses
│   │   └── summary.py           # GET /api/summary
│   ├── services/
│   │   ├── ocr_service.py       # LangChain + Upstage Vision LLM 파싱 로직
│   │   └── storage_service.py   # expenses.json 읽기/쓰기/UUID 생성
│   ├── data/
│   │   └── expenses.json        # 데이터 저장소 (DB 대신 JSON 배열)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/               # Dashboard, UploadPage, ExpenseDetail
│       ├── components/          # ExpenseCard, SummaryCard, DropZone, ParsePreview,
│       │                        #   FilterBar, Badge, Modal, Toast, ProgressBar
│       └── api/axios.js         # Axios 인스턴스 (VITE_API_BASE_URL 기반)
├── images/                      # 테스트용 샘플 영수증 이미지
├── vercel.json                  # 배포 라우팅 설정
├── PRD_영수증_지출관리앱.md
└── 프로그램개요서_영수증_지출관리앱.md
```

### 핵심 데이터 흐름

```
[브라우저 DropZone]
    │  multipart/form-data
    ▼
[POST /api/upload]  →  파일 검증 (형식·10MB 제한)
    │
    ▼
[ocr_service.py]
    ├─ JPG/PNG: Pillow → Base64
    ├─ PDF: pdf2image → Base64
    └─ LangChain Chain:
         ChatUpstage(Vision) + PromptTemplate + JsonOutputParser
    │
    ▼
[storage_service.py]  →  UUID 부여 → expenses.json append 저장
    │
    ▼
[ParsePreview 컴포넌트]  →  인라인 편집 → 저장 시 PUT /api/expenses/{id}
```

### LangChain Chain 구성 (`ocr_service.py`)

```python
chain = prompt | ChatUpstage(model="document-digitization-vision") | JsonOutputParser()
```

- 시스템 프롬프트에 JSON 스키마를 명시하여 구조화된 출력 강제
- PDF는 `pdf2image` + Poppler로 첫 페이지만 변환 후 처리

### 데이터 저장 구조

`expenses.json`은 단일 JSON 배열. 스키마:

```json
{
  "id": "uuid-v4",
  "created_at": "ISO8601",
  "store_name": "string",
  "receipt_date": "YYYY-MM-DD",
  "receipt_time": "HH:MM | null",
  "category": "식료품|외식|교통|쇼핑|의료|기타",
  "items": [{"name": "", "quantity": 0, "unit_price": 0, "total_price": 0}],
  "subtotal": 0,
  "discount": 0,
  "tax": 0,
  "total_amount": 0,
  "payment_method": "string | null",
  "raw_image_path": "uploads/filename"
}
```

---

## 주요 제약사항

- **DB 미사용**: `expenses.json` 파일이 유일한 데이터 저장소. Vercel 서버리스 배포 시 파일이 유지되지 않으므로 `localStorage` 병행 저장 또는 Railway/Render 배포로 전환 필요.
- **파일 업로드 제한**: JPG, PNG, PDF만 허용 / 최대 10MB. 서버·클라이언트 양쪽에서 검증.
- **단일 사용자**: 동시성 제어 없음. 개인 프로젝트 MVP 기준.
- **PDF 변환**: `pdf2image`는 시스템에 Poppler가 설치되어 있어야 동작.

---

## 샘플 이미지

`images/` 디렉토리에 OCR 테스트용 실제 영수증 이미지 포함:

| 파일 | 업종 |
|------|------|
| `01_emart.png` | 이마트 (식료품) |
| `02_starbucks.png` | 스타벅스 (외식) |
| `03_cu.jpg` | CU 편의점 |
| `04_lotteria.png` | 롯데리아 (외식) |
| `GS25편의점_영수증.pdf` | GS25 PDF 영수증 |

`images/ui/` 에는 이전 개발 시 발생한 UI 오류 스크린샷이 있어 예외 케이스 파악에 활용 가능.

---

## 배포

```bash
# Vercel CLI 배포
vercel --prod

# 환경변수는 Vercel 대시보드 또는 CLI로 등록
vercel env add UPSTAGE_API_KEY
vercel env add VITE_API_BASE_URL
```

`vercel.json` 라우팅: `/api/*` → `backend/main.py`, 나머지 → `frontend/dist/`.
