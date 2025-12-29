// components/StatCard.jsx
export default function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/60 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-500`} />
      
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-4xl font-black text-slate-900 tabular-nums">
          {value.toLocaleString()}
        </h2>
      </div>
    </div>
  );
}