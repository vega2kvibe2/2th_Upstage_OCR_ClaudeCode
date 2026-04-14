import { useState } from 'react'
import Badge from './Badge'

const CATEGORIES = ['식료품', '외식', '교통', '쇼핑', '의료', '기타']

export default function ParsePreview({ data, onSave, onCancel }) {
  const [form, setForm] = useState({ ...data })

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setItem(idx, key, value) {
    setForm((prev) => {
      const items = [...(prev.items ?? [])]
      items[idx] = { ...items[idx], [key]: value }
      return { ...prev, items }
    })
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm animate-slide-up">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">파싱 결과 확인 · 수정</h2>
        <Badge category={form.category} />
      </div>

      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 기본 정보 */}
        <Field label="가게명">
          <input className={inputCls} value={form.store_name ?? ''} onChange={(e) => set('store_name', e.target.value)} />
        </Field>
        <Field label="카테고리">
          <select className={inputCls} value={form.category ?? ''} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="날짜">
          <input className={inputCls} type="date" value={form.receipt_date ?? ''} onChange={(e) => set('receipt_date', e.target.value)} />
        </Field>
        <Field label="시간">
          <input className={inputCls} type="time" value={form.receipt_time ?? ''} onChange={(e) => set('receipt_time', e.target.value)} />
        </Field>
        <Field label="결제 수단">
          <input className={inputCls} value={form.payment_method ?? ''} onChange={(e) => set('payment_method', e.target.value)} />
        </Field>
        <Field label="합계 (원)">
          <input className={inputCls} type="number" value={form.total_amount ?? 0} onChange={(e) => set('total_amount', Number(e.target.value))} />
        </Field>
        <Field label="소계 (원)">
          <input className={inputCls} type="number" value={form.subtotal ?? 0} onChange={(e) => set('subtotal', Number(e.target.value))} />
        </Field>
        <Field label="할인 (원)">
          <input className={inputCls} type="number" value={form.discount ?? 0} onChange={(e) => set('discount', Number(e.target.value))} />
        </Field>
      </div>

      {/* 품목 목록 */}
      {form.items?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">품목</p>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="py-2 px-3 text-left">품명</th>
                  <th className="py-2 px-3 text-right">수량</th>
                  <th className="py-2 px-3 text-right">단가</th>
                  <th className="py-2 px-3 text-right">금액</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-1.5 px-3">
                      <input className="w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none" value={item.name ?? ''} onChange={(e) => setItem(i, 'name', e.target.value)} />
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      <input className="w-14 text-right bg-transparent border-b border-transparent focus:border-blue-400 outline-none" type="number" value={item.quantity ?? 0} onChange={(e) => setItem(i, 'quantity', Number(e.target.value))} />
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      <input className="w-20 text-right bg-transparent border-b border-transparent focus:border-blue-400 outline-none" type="number" value={item.unit_price ?? 0} onChange={(e) => setItem(i, 'unit_price', Number(e.target.value))} />
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {((item.quantity ?? 0) * (item.unit_price ?? 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={() => onSave(form)}
          className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          저장하기
        </button>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white'

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  )
}
