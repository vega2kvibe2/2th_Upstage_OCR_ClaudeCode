from fastapi import APIRouter
from typing import Optional
from datetime import date
from collections import defaultdict

from backend.services.storage_service import load_expenses

router = APIRouter()


@router.get("/summary")
async def get_summary(month: Optional[str] = None):
    expenses = load_expenses()

    # this_month 기준: 파라미터가 없으면 현재 월 사용
    current_month = month or date.today().strftime("%Y-%m")

    total_amount = sum(e.get("total_amount", 0) for e in expenses)
    this_month_amount = sum(
        e.get("total_amount", 0)
        for e in expenses
        if e.get("receipt_date", "").startswith(current_month)
    )

    category_map: dict = defaultdict(int)
    for e in expenses:
        if e.get("receipt_date", "").startswith(current_month):
            category_map[e.get("category", "기타")] += e.get("total_amount", 0)

    category_summary = [
        {"category": cat, "amount": amt}
        for cat, amt in sorted(category_map.items(), key=lambda x: -x[1])
    ]

    return {
        "total_amount": total_amount,
        "this_month_amount": this_month_amount,
        "category_summary": category_summary,
    }
