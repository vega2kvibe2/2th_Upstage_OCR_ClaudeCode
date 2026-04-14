import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Header from '../components/Header'
import Badge from '../components/Badge'
import ReceiptImage from '../components/ReceiptImage'
import EditForm from '../components/EditForm'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function ExpenseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/api/expenses')
        const found = data.find((e) => e.id === id)
        if (!found) { setNotFound(true); return }
        setExpense(found)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSave(form) {
    setSaving(true)
    try {
      const { data } = await api.put(`/api/expenses/${id}`, form)
      setExpense(data)

      // localStorage 동기화
      const stored = JSON.parse(localStorage.getItem('expenses') ?? '[]')
      const idx = stored.findIndex((e) => e.id === id)
      if (idx >= 0) stored[idx] = data
      localStorage.setItem('expenses', JSON.stringify(stored))

      showToast('수정 내용이 저장됐습니다.', 'success')
    } catch {
      showToast('저장에 실패했습니다.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/api/expenses/${id}`)

      // localStorage 동기화
      const stored = JSON.parse(localStorage.getItem('expenses') ?? '[]')
      localStorage.setItem('expenses', JSON.stringify(stored.filter((e) => e.id !== id)))

      navigate('/', { replace: true })
    } catch {
      setShowModal(false)
      showToast('삭제에 실패했습니다.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </main>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-slate-600 font-medium mb-4">해당 지출 내역을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            대시보드로 이동
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* 상단 타이틀 + 삭제 버튼 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{expense.store_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">{expense.receipt_date}</span>
              <Badge category={expense.category} />
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 px-3 py-1.5 text-sm text-red-500 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            삭제
          </button>
        </div>

        {/* 원본 이미지 */}
        <ReceiptImage path={expense.raw_image_path} storeName={expense.store_name} />

        {/* 수정 폼 */}
        <EditForm data={expense} onSave={handleSave} saving={saving} />
      </main>

      {/* 삭제 확인 Modal */}
      {showModal && (
        <Modal
          title="지출 내역 삭제"
          message={`"${expense.store_name}" 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
