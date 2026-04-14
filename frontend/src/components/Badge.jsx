const COLOR = {
  식료품: 'bg-green-100 text-green-700',
  외식:   'bg-orange-100 text-orange-700',
  교통:   'bg-sky-100 text-sky-700',
  쇼핑:   'bg-violet-100 text-violet-700',
  의료:   'bg-rose-100 text-rose-700',
  기타:   'bg-slate-100 text-slate-600',
}

export default function Badge({ category }) {
  const style = COLOR[category] ?? COLOR['기타']
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {category ?? '기타'}
    </span>
  )
}
