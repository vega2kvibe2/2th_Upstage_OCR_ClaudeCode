import { useNavigate } from 'react-router-dom'
import Badge from './Badge'

export default function ExpenseCard({ expense }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/expense/${expense.id}`)}
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all active:scale-[0.98] animate-slide-up"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">
          {expense.store_name}
        </h3>
        <Badge category={expense.category} />
      </div>

      <p className="text-xl font-bold text-slate-900 mb-2">
        {(expense.total_amount ?? 0).toLocaleString()}원
      </p>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{expense.receipt_date}</span>
        {expense.payment_method && (
          <span className="truncate max-w-[120px]">{expense.payment_method}</span>
        )}
      </div>
    </div>
  )
}
