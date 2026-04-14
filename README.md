# 영수증 지출 관리 앱

영수증(JPG/PNG/PDF)을 업로드하면 **Upstage Document Parse + solar-pro2**가 자동으로 파싱하여 지출 데이터를 구조화하는 웹 애플리케이션입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | FastAPI, LangChain, langchain-upstage |
| OCR | Upstage Document Parse API (UpstageDocumentParseLoader) |
| LLM | Upstage solar-pro2 (JSON 구조화 추출) |
| 프론트엔드 | React 18, Vite 5, TailwindCSS 3 |
| 데이터 저장 | expenses.json (로컬) / localStorage (브라우저) |

## 로컬 개발

### 1. 백엔드

```bash
python -m venv venv
source venv/Scripts/activate        # Windows
pip install -r requirements.txt

# backend/.env 설정
cp backend/.env.example backend/.env
# UPSTAGE_API_KEY 값 입력

uvicorn backend.main:app --reload --port 8000
# → http://localhost:8000/docs
```

### 2. 프론트엔드

```bash
cd frontend
npm install
# frontend/.env.local 설정
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
# → http://localhost:5173
```

## 배포

### 백엔드 → Railway

1. [railway.app](https://railway.app) 에서 New Project → GitHub Repo 연결
2. 환경변수 설정:
   ```
   UPSTAGE_API_KEY=...
   DATA_FILE_PATH=/app/backend/data/expenses.json
   ```
3. `railway.toml` 기준으로 자동 배포됩니다.
4. 배포 후 Railway에서 제공하는 URL을 복사합니다. (예: `https://your-app.up.railway.app`)

### 프론트엔드 → Vercel

1. [vercel.com](https://vercel.com) 에서 New Project → GitHub Repo 연결
2. **Framework Preset**: Other
3. **Build Command**: `cd frontend && npm install && npm run build`
4. **Output Directory**: `frontend/dist`
5. 환경변수 설정:
   ```
   VITE_API_BASE_URL=https://your-app.up.railway.app
   ```
6. Deploy 클릭

## API 엔드포인트

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/upload` | 영수증 파일 업로드 및 OCR 파싱 |
| GET | `/api/expenses` | 지출 목록 조회 (날짜 필터 지원) |
| PUT | `/api/expenses/{id}` | 지출 항목 수정 |
| DELETE | `/api/expenses/{id}` | 지출 항목 삭제 |
| GET | `/api/summary` | 월별 통계 조회 |
| GET | `/uploads/{filename}` | 원본 영수증 이미지 서빙 |

## 주의사항

- **Railway 배포 시** 인스턴스가 재시작되면 `expenses.json`이 초기화될 수 있습니다.
  Volume을 연결하거나 PostgreSQL로 전환하는 것을 권장합니다.
- **Vercel 서버리스 배포는 백엔드에 적합하지 않습니다.** 프론트엔드 전용으로만 사용하세요.
