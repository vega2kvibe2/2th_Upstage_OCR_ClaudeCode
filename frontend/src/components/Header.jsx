import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-lg text-slate-800 hover:text-blue-600 transition-colors"
        >
          <span className="text-2xl">🧾</span>
          <span>영수증 지출 관리</span>
        </button>

        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <span className="text-base leading-none">+</span>
          영수증 추가
        </button>
      </div>
    </header>
  )
}
