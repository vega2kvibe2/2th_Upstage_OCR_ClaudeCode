import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Header from '../components/Header'
import SummaryCard from '../components/SummaryCard'
import FilterBar from '../components/FilterBar'
import ExpenseCard from '../components/ExpenseCard'

export default function Dashboard() {
  const navigate = useNavigate()

  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const [loadingSummary, setLoadingSummary] = useState(true)

  const fetchData = useCallback(async ({ from = '', to = '' } = {}) => {
    setLoadingExpenses(true)
    try {
      const params = {}
      if (from) params.from_date = from
      if (to) params.to_date = to
      const { data } = await api.get('/api/expenses', { params })
      // 최신순 정렬
      setExpenses([...data].sort((a, b) => (b.receipt_date ?? '').localeCompare(a.receipt_date ?? '')))
    } finally {
      setLoadingExpenses(false)
    }
  }, [])

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true)
    try {
      const { data } = await api.get('/api/summary')
      setSummary(data)
    } finally {
      setLoadingSummary(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    fetchSummary()
  }, [fetchData, fetchSummary])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 요약 카드 */}
        <SummaryCard summary={summary} loading={loadingSummary} />

        {/* 날짜 필터 */}
        <FilterBar onFilter={fetchData} />

        {/* 지출 목록 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-700">
              지출 내역
              {!loadingExpenses && (
                <span className="ml-2 text-sm font-normal text-slate-400">{expenses.length}건</span>
              )}
            </h2>
          </div>

          {loadingExpenses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <EmptyState onAdd={() => navigate('/upload')} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses.map((e) => (
                <ExpenseCard key={e.id} expense={e} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <span className="text-6xl mb-4">🧾</span>
      <p className="text-slate-600 font-medium mb-1">아직 등록된 지출이 없습니다</p>
      <p className="text-sm text-slate-400 mb-6">영수증을 업로드하면 자동으로 파싱됩니다</p>
      <button
        onClick={onAdd}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        첫 영수증 등록하기
      </button>
    </div>
  )
}
