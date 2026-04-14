import { useState } from 'react'

export default function ReceiptImage({ path, storeName }) {
  const [error, setError] = useState(false)

  if (!path || error) {
    return (
      <div className="flex items-center justify-center w-full h-48 bg-slate-100 rounded-xl border border-slate-200 text-slate-400 text-sm">
        이미지를 불러올 수 없습니다
      </div>
    )
  }

  // backend/uploads/filename → API 서버 경로로 변환
  const src = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${path}`

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <img
        src={src}
        alt={`${storeName} 영수증`}
        className="w-full object-contain max-h-96"
        onError={() => setError(true)}
      />
    </div>
  )
}
