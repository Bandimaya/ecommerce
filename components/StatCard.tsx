// components/StatCard.jsx
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon, color, trend }: any) {
  const colorMap: Record<string, string> = {
    primary: "hsl(var(--primary))",
    blue: "hsl(var(--blue))",
    emerald: "hsl(var(--emerald))",
    violet: "hsl(var(--violet))",
    destructive: "hsl(var(--destructive))",
  };

  const statColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all relative overflow-hidden cursor-pointer"
      style={{ '--stat-color': statColor } as React.CSSProperties}
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--stat-color)] opacity-5 rounded-full group-hover:scale-150 transition-transform duration-300" />

      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-[var(--stat-color)] text-primary-foreground shadow-lg shadow-[var(--stat-color)]/30">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-foreground tabular-nums">
          {value.toLocaleString()}
        </h2>
      </div>
    </motion.div>
  );
}