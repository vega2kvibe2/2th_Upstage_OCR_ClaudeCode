import { useState } from 'react'

export default function FilterBar({ onFilter }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  function handleSearch() {
    onFilter({ from, to })
  }

  function handleReset() {
    setFrom('')
    setTo('')
    onFilter({ from: '', to: '' })
  }

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">시작일</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">종료일</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        조회
      </button>
      <button
        onClick={handleReset}
        className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors"
      >
        초기화
      </button>
    </div>
  )
}
