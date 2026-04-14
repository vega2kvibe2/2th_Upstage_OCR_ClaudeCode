import json
import uuid
from datetime import datetime
from pathlib import Path
import os

DATA_FILE = Path(os.getenv("DATA_FILE_PATH", "backend/data/expenses.json"))


def load_expenses() -> list:
    if not DATA_FILE.exists():
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text("[]", encoding="utf-8")
        return []
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def save_expenses(data: list) -> None:
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def append_expense(item: dict) -> dict:
    item["id"] = str(uuid.uuid4())
    item["created_at"] = datetime.utcnow().isoformat() + "Z"
    expenses = load_expenses()
    expenses.append(item)
    save_expenses(expenses)
    return item
