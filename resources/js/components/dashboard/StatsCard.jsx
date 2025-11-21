import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatsCard({ title, value, change, icon, className, trendLabel = "vs last week" }) {
  return (
    <Card className={cn("border-none bg-white/80 shadow-sm backdrop-blur", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className="rounded-2xl bg-slate-100 px-3 py-1 text-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-slate-900">{value}</div>
        {change && (
          <p
            className={cn(
              "mt-2 text-sm",
              change > 0 ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}% {trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

