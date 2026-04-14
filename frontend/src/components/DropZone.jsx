import { useRef, useState } from 'react'

const ACCEPT = ['image/jpeg', 'image/png', 'application/pdf']

export default function DropZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleFiles(files) {
    const file = files[0]
    if (!file) return
    if (!ACCEPT.includes(file.type)) {
      alert('JPG, PNG, PDF 파일만 업로드할 수 있습니다.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.')
      return
    }
    onFile(file)
  }

  function onDragOver(e) {
    e.preventDefault()
    if (!disabled) setDragging(true)
  }

  function onDragLeave() {
    setDragging(false)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        flex flex-col items-center justify-center gap-3
        w-full h-52 rounded-2xl border-2 border-dashed cursor-pointer
        transition-all select-none
        ${disabled
          ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
          : dragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'
        }
      `}
    >
      <span className="text-5xl">{dragging ? '📂' : '📁'}</span>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          파일을 드래그하거나 클릭하여 업로드
        </p>
        <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, PDF · 최대 10MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
