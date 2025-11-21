import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PromoBanner() {
  return (
    <Card className="overflow-hidden border-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <Badge className="bg-amber-400 text-slate-900 hover:bg-amber-400">
            Creative Associate • live orchestration
          </Badge>
          <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
            Unified safety certificates across QLD · NSW · VIC
          </h3>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Monitor bookings, dispatch inspectors, and close compliance loops
            without leaving the command center—designed for field teams on the
            move.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <div className="text-right">
            <p className="text-3xl font-semibold text-amber-300">98.4%</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              on-time clearance
            </p>
          </div>
          <Button className="rounded-2xl bg-white/10 px-6 text-white hover:bg-white/20">
            View inspection schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

