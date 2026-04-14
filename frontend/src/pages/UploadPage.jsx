import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Header from '../components/Header'
import DropZone from '../components/DropZone'
import ProgressBar from '../components/ProgressBar'
import ParsePreview from '../components/ParsePreview'
import Toast from '../components/Toast'

export default function UploadPage() {
  const navigate = useNavigate()

  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [parsed, setParsed] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
  }, [])

  async function handleFile(file) {
    setStatus('loading')
    setParsed(null)
    setErrorMsg('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setParsed(data)
      setStatus('done')
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'OCR 파싱에 실패했습니다.'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  async function handleSave(form) {
    try {
      await api.put(`/api/expenses/${form.id}`, form)

      // localStorage 병행 저장
      const stored = JSON.parse(localStorage.getItem('expenses') ?? '[]')
      const idx = stored.findIndex((e) => e.id === form.id)
      if (idx >= 0) stored[idx] = form
      else stored.unshift(form)
      localStorage.setItem('expenses', JSON.stringify(stored))

      showToast('지출이 저장됐습니다!', 'success')
      setTimeout(() => navigate('/'), 800)
    } catch {
      showToast('저장에 실패했습니다.', 'error')
    }
  }

  function handleCancel() {
    setStatus('idle')
    setParsed(null)
    setErrorMsg('')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-slate-800 mb-6">영수증 업로드</h1>

        {/* DropZone */}
        <DropZone onFile={handleFile} disabled={status === 'loading'} />

        {/* ProgressBar */}
        <div className="mt-4">
          <ProgressBar visible={status === 'loading'} />
        </div>

        {/* 오류 배너 */}
        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-xl flex items-start justify-between gap-3 animate-fade-in">
            <div>
              <p className="text-sm font-semibold text-red-700">OCR 파싱 실패</p>
              <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
            </div>
            <button
              onClick={handleCancel}
              className="shrink-0 text-sm font-medium text-red-600 underline hover:no-underline"
            >
              재시도
            </button>
          </div>
        )}

        {/* ParsePreview */}
        {status === 'done' && parsed && (
          <div className="mt-6">
            <ParsePreview data={parsed} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}
      </main>

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
