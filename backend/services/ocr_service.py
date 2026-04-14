import os
import tempfile
from pathlib import Path

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_upstage import ChatUpstage, UpstageDocumentParseLoader

EXTRACT_PROMPT = """당신은 영수증 데이터 추출 전문가입니다.
아래 영수증 텍스트에서 정보를 추출하여 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

출력 형식:
{{
  "store_name": "string",
  "receipt_date": "YYYY-MM-DD",
  "receipt_time": "HH:MM or null",
  "category": "식료품|외식|교통|쇼핑|의료|기타",
  "items": [{{"name": "string", "quantity": int, "unit_price": int, "total_price": int}}],
  "subtotal": int,
  "discount": int,
  "tax": int,
  "total_amount": int,
  "payment_method": "string or null"
}}

규칙:
- receipt_date 가 불명확하면 오늘 날짜를 사용하세요.
- 금액은 원 단위 정수로 반환하세요. 쉼표·통화기호 없이 숫자만.
- items 가 없으면 빈 배열 []을 사용하세요.
- discount, tax 가 없으면 0을 사용하세요.
- category 는 반드시 위 6가지 중 하나를 선택하세요.

영수증 텍스트:
{receipt_text}"""


def parse_receipt(file_bytes: bytes, content_type: str) -> dict:
    # 1. 임시 파일로 저장 (UpstageDocumentParseLoader가 파일 경로 필요)
    suffix = ".pdf" if content_type == "application/pdf" else ".png"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        # 2. Upstage Document Parse로 OCR 수행
        ocr_mode = "auto" if content_type == "application/pdf" else "force"
        loader = UpstageDocumentParseLoader(
            file_path=tmp_path,
            ocr=ocr_mode,
            output_format="text",
            coordinates=False,
        )
        docs = loader.load()
        receipt_text = "\n".join(doc.page_content for doc in docs)

        if not receipt_text.strip():
            raise ValueError("OCR 결과가 비어 있습니다.")

    finally:
        Path(tmp_path).unlink(missing_ok=True)

    # 3. LangChain으로 구조화 JSON 추출
    prompt = ChatPromptTemplate.from_template(EXTRACT_PROMPT)
    llm = ChatUpstage(model=os.getenv("UPSTAGE_TEXT_MODEL", "solar-pro2"))
    chain = prompt | llm | JsonOutputParser()

    result = chain.invoke({"receipt_text": receipt_text})
    return result
