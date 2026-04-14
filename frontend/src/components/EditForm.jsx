import { useState } from 'react'
import Badge from './Badge'

const CATEGORIES = ['식료품', '외식', '교통', '쇼핑', '의료', '기타']

export default function EditForm({ data, onSave, saving }) {
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

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items ?? []), { name: '', quantity: 1, unit_price: 0, total_price: 0 }],
    }))
  }

  function removeItem(idx) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }))
  }

  return (
    <div className="space-y-5">
      {/* 기본 정보 */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="가게명">
            <input className={cls} value={form.store_name ?? ''} onChange={(e) => set('store_name', e.target.value)} />
          </Field>
          <Field label="카테고리">
            <select className={cls} value={form.category ?? ''} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="날짜">
            <input className={cls} type="date" value={form.receipt_date ?? ''} onChange={(e) => set('receipt_date', e.target.value)} />
          </Field>
          <Field label="시간">
            <input className={cls} type="time" value={form.receipt_time ?? ''} onChange={(e) => set('receipt_time', e.target.value)} />
          </Field>
          <Field label="결제 수단">
            <input className={cls} value={form.payment_method ?? ''} onChange={(e) => set('payment_method', e.target.value)} />
          </Field>
        </div>
      </section>

      {/* 금액 */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">금액</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="합계 (원)">
            <input className={cls} type="number" value={form.total_amount ?? 0} onChange={(e) => set('total_amount', Number(e.target.value))} />
          </Field>
          <Field label="소계 (원)">
            <input className={cls} type="number" value={form.subtotal ?? 0} onChange={(e) => set('subtotal', Number(e.target.value))} />
          </Field>
          <Field label="할인 (원)">
            <input className={cls} type="number" value={form.discount ?? 0} onChange={(e) => set('discount', Number(e.target.value))} />
          </Field>
          <Field label="세금 (원)">
            <input className={cls} type="number" value={form.tax ?? 0} onChange={(e) => set('tax', Number(e.target.value))} />
          </Field>
        </div>
      </section>

      {/* 품목 */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">품목</h3>
          <button
            type="button"
            onClick={addItem}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            + 품목 추가
          </button>
        </div>
        {(form.items ?? []).length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">등록된 품목이 없습니다</p>
        ) : (
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="py-2 px-3 text-left">품명</th>
                  <th className="py-2 px-3 text-right w-16">수량</th>
                  <th className="py-2 px-3 text-right w-24">단가</th>
                  <th className="py-2 px-3 text-right w-24">금액</th>
                  <th className="py-2 px-2 w-8" />
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-1.5 px-3">
                      <input className="w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none" value={item.name ?? ''} onChange={(e) => setItem(i, 'name', e.target.value)} />
                    </td>
                    <td className="py-1.5 px-3">
                      <input className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-400 outline-none" type="number" value={item.quantity ?? 0} onChange={(e) => setItem(i, 'quantity', Number(e.target.value))} />
                    </td>
                    <td className="py-1.5 px-3">
                      <input className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-400 outline-none" type="number" value={item.unit_price ?? 0} onChange={(e) => setItem(i, 'unit_price', Number(e.target.value))} />
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-500">
                      {((item.quantity ?? 0) * (item.unit_price ?? 0)).toLocaleString()}
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button type="button" onClick={() => removeItem(i)} className="text-slate-300 hover:text-red-400 transition-colors text-base leading-none">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-60 transition-all"
        >
          {saving ? '저장 중...' : '수정 저장'}
        </button>
      </div>
    </div>
  )
}

const cls = 'w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white'

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  )
}
