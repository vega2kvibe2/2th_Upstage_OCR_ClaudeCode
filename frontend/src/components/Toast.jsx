import { useEffect } from 'react'

const STYLES = {
  success: 'bg-emerald-50 border-emerald-400 text-emerald-800',
  error:   'bg-red-50 border-red-400 text-red-800',
  info:    'bg-blue-50 border-blue-400 text-blue-800',
}

const ICONS = {
  success: '✅',
  error:   '❌',
  info:    'ℹ️',
}

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 flex items-center gap-2.5
        px-4 py-3 rounded-lg border shadow-lg
        animate-fade-in max-w-sm
        ${STYLES[type]}
      `}
    >
      <span>{ICONS[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-current opacity-50 hover:opacity-100 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
