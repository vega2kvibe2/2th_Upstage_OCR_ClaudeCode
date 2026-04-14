export default function SummaryCard({ summary, loading }) {
  const fmt = (n) => (n ?? 0).toLocaleString() + '원'

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label="전체 지출" value={fmt(summary?.total_amount)} icon="💳" color="bg-blue-50 border-blue-100" />
      <Card label="이번 달 지출" value={fmt(summary?.this_month_amount)} icon="📅" color="bg-emerald-50 border-emerald-100" />
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">카테고리별</p>
        {summary?.category_summary?.length > 0 ? (
          <ul className="space-y-1">
            {summary.category_summary.slice(0, 3).map((c) => (
              <li key={c.category} className="flex justify-between text-sm">
                <span className="text-slate-600">{c.category}</span>
                <span className="font-semibold text-slate-800">{c.amount.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">데이터 없음</p>
        )}
      </div>
    </div>
  )
}

function Card({ label, value, icon, color }) {
  return (
    <div className={`border rounded-2xl p-4 shadow-sm ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}
