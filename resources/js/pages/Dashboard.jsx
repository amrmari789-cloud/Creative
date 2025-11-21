import { PromoBanner } from "@/components/dashboard/PromoBanner"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { DataTable } from "@/components/dashboard/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const statsData = [
  {
    title: "Certificates issued",
    value: "312",
    change: 4.6,
    icon: "✅",
    trendLabel: "vs yesterday",
  },
  {
    title: "On-site inspectors",
    value: "24",
    change: 12.5,
    icon: "🦺",
    trendLabel: "currently active",
  },
  {
    title: "Pending bookings",
    value: "48",
    change: -6.2,
    icon: "📅",
    trendLabel: "vs last week",
  },
  {
    title: "Avg. clearance time",
    value: "58 min",
    change: 8.3,
    icon: "⏱️",
    trendLabel: "faster than SLA",
  },
]

const activityLog = [
  { title: "NSW • Fleet of 6 approved", time: "4 mins ago", status: "Completed" },
  { title: "QLD • Mobile inspector dispatched", time: "18 mins ago", status: "En route" },
  { title: "VIC • Payment confirmed", time: "1 hr ago", status: "Completed" },
]

const quickActions = [
  { label: "New booking", icon: "➕" },
  { label: "Assign inspector", icon: "🧭" },
  { label: "Upload photos", icon: "📷" },
  { label: "Send certificate", icon: "📨" },
]

const regionalLoad = [
  { region: "Queensland", load: 68, inspectors: 9 },
  { region: "New South Wales", load: 54, inspectors: 8 },
  { region: "Victoria", load: 47, inspectors: 7 },
]

const tableColumns = [
  { key: "jobId", label: "Job" },
  { key: "customer", label: "Customer" },
  { key: "plate", label: "Plate" },
  { key: "region", label: "Region" },
  { key: "status", label: "Status" },
  { key: "slot", label: "Slot" },
]

const tableData = [
  {
    jobId: "FR-9812",
    customer: "Fleetline Logistics",
    plate: "QLD · 762-WRT",
    region: "Queensland",
    status: "Active",
    slot: "08:30 AM",
  },
  {
    jobId: "FR-9802",
    customer: "Metro Rentals",
    plate: "NSW · DQ-55-LP",
    region: "New South Wales",
    status: "Pending",
    slot: "10:15 AM",
  },
  {
    jobId: "FR-9789",
    customer: "Allied Crane Hire",
    plate: "VIC · 1ZH-9TC",
    region: "Victoria",
    status: "Active",
    slot: "11:40 AM",
  },
  {
    jobId: "FR-9782",
    customer: "Transcoast",
    plate: "QLD · 339-TYK",
    region: "Queensland",
    status: "Completed",
    slot: "07:20 AM",
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
        <PromoBanner />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              trendLabel={stat.trendLabel}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Live activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Stream of bookings and certificates issued today
                </p>
              </div>
              <Badge variant="secondary">Auto-updating</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityLog.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="flex items-center justify-between rounded-2xl border-slate-200 bg-white text-slate-900 hover:border-amber-300 hover:bg-amber-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{action.icon}</span>
                    {action.label}
                  </span>
                  <span className="text-xs text-muted-foreground">↗</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Regional load</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {regionalLoad.map((region) => (
                <div key={region.region}>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-slate-900">{region.region}</p>
                    <span className="text-muted-foreground">
                      {region.inspectors} inspectors
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${region.load}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl border bg-white/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Safety certificates
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  98.4%
                </p>
                <p className="text-xs text-muted-foreground">
                  SLA met across all regions
                </p>
              </div>
              <div className="rounded-2xl border bg-white/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Re-inspections
                </p>
                <p className="mt-2 text-3xl font-semibold text-rose-500">3</p>
                <p className="text-xs text-muted-foreground">
                  Scheduled within the next 24 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Active jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={tableData} columns={tableColumns} />
          </CardContent>
        </Card>
    </div>
  )
}

