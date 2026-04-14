from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel

from backend.services.storage_service import load_expenses, save_expenses

router = APIRouter()


class ExpenseUpdate(BaseModel):
    store_name: Optional[str] = None
    receipt_date: Optional[str] = None
    receipt_time: Optional[str] = None
    category: Optional[str] = None
    items: Optional[list] = None
    subtotal: Optional[int] = None
    discount: Optional[int] = None
    tax: Optional[int] = None
    total_amount: Optional[int] = None
    payment_method: Optional[str] = None


@router.get("/expenses")
async def get_expenses(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
):
    expenses = load_expenses()

    if from_date:
        expenses = [e for e in expenses if e.get("receipt_date", "") >= from_date]
    if to_date:
        expenses = [e for e in expenses if e.get("receipt_date", "") <= to_date]

    return expenses


@router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str):
    expenses = load_expenses()
    filtered = [e for e in expenses if e.get("id") != expense_id]

    if len(filtered) == len(expenses):
        raise HTTPException(status_code=404, detail=f"ID '{expense_id}'를 찾을 수 없습니다.")

    save_expenses(filtered)
    return {"message": f"ID '{expense_id}' 삭제 완료"}


@router.put("/expenses/{expense_id}")
async def update_expense(expense_id: str, body: ExpenseUpdate):
    expenses = load_expenses()
    idx = next((i for i, e in enumerate(expenses) if e.get("id") == expense_id), None)

    if idx is None:
        raise HTTPException(status_code=404, detail=f"ID '{expense_id}'를 찾을 수 없습니다.")

    updates = body.model_dump(exclude_none=True)
    expenses[idx].update(updates)
    save_expenses(expenses)
    return expenses[idx]
