export default function ProgressBar({ visible }) {
  if (!visible) return null

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-blue-700">
          OCR 분석 중...
        </span>
        <span className="text-xs text-slate-400">잠시만 기다려 주세요</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full animate-progress-fill" />
      </div>
    </div>
  )
}
