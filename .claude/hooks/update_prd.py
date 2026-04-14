#!/usr/bin/env python3
"""
PostToolUse hook: Write|Edit 후 PRD 동기화 컨텍스트 주입
- PRD 파일 자체 수정 시 → 건너뜀 (무한루프 방지)
- backend/, frontend/, requirements.txt 등 소스 파일만 트리거
- additionalContext 출력 → Claude가 PRD 자동 업데이트
"""

import io
import json
import sys

# Windows 콘솔 UTF-8 강제 처리
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8")


SKIP_PATTERNS = [
    "PRD_",
    "CLAUDE.md",
    ".gitignore",
    "settings.json",
    ".claude/",
    "memory/",
    "venv/",
    "__pycache__",
    ".pyc",
    "node_modules/",
]

TRIGGER_PATTERNS = [
    "backend/",
    "frontend/",
    "requirements.txt",
    ".env.example",
    "vercel.json",
]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path:
        sys.exit(0)

    # 건너뛸 파일 패턴 확인
    if any(p in file_path for p in SKIP_PATTERNS):
        sys.exit(0)

    # 트리거 대상 파일 패턴 확인
    if not any(p in file_path for p in TRIGGER_PATTERNS):
        sys.exit(0)

    # Claude에게 PRD 동기화 컨텍스트 주입
    message = (
        f"[PRD 자동 동기화 요청] 소스 파일이 수정되었습니다: {file_path}\n"
        "방금 수정한 내용이 아래 항목 중 하나라도 해당된다면 "
        "PRD_영수증_지출관리앱.md 문서를 즉시 업데이트하세요:\n"
        "  - 기술 스택 버전 변경 (11. 기술 스택 표)\n"
        "  - requirements.txt 패키지 변경 (Phase 1 requirements.txt 코드 블록)\n"
        "  - 디렉토리 구조 변경 (12. 프로젝트 디렉토리 구조)\n"
        "  - API 엔드포인트 변경 (8. API 명세)\n"
        "  - Phase 완료 기준 충족 (13. Phase 완료 기준 체크박스)\n"
        "단순 로직 수정이라 PRD에 영향 없으면 건너뛰어도 됩니다."
    )

    output = {
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": message,
        }
    }
    print(json.dumps(output, ensure_ascii=False))


if __name__ == "__main__":
    main()
