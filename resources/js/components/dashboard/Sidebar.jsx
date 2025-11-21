import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { CreativeAssociateLogo } from "@/components/CreativeAssociateLogo"
import { usePermissions } from "@/hooks/usePermissions"

const menuItems = [
  { icon: "📊", label: "Overview", path: "/", permission: "view-dashboard" },
  { icon: "📋", label: "Inspections", path: "/orders", permission: "view-inspections" },
  { icon: "🧾", label: "Certificates", path: "/certificates", permission: "view-certificates" },
  { icon: "👥", label: "Clients", path: "/customers", permission: "view-clients" },
  { icon: "🚚", label: "Fleet", path: "/fleet", permission: "view-fleet" },
  { icon: "📈", label: "Analytics", path: "/analytics", permission: "view-analytics" },
  { icon: "➕", label: "User Create", path: "/users/create", permission: "create-users" },
  { icon: "👥", label: "Users", path: "/users", permission: "view-users" },
  { icon: "📦", label: "Packages", path: "/packages", permission: "edit-settings" },
  { icon: "👤", label: "Profile", path: "/profile", permission: "view-profile" },
  { icon: "⚙️", label: "Settings", path: "/settings", permission: "view-settings" },
]

const focusHighlights = [
  { label: "QLD", value: "18 checks" },
  { label: "NSW", value: "12 checks" },
  { label: "VIC", value: "9 checks" },
]

export function Sidebar({
  currentPath = "/",
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}) {
  const { hasPermission } = usePermissions()

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-xl transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div
        className={cn(
          "px-6 py-8",
          isCollapsed && "px-3 text-center"
        )}
      >
        <div className="relative flex items-center gap-3">
          {isMobile && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 text-white hover:bg-white/10 lg:hidden"
              onClick={onCloseMobile}
            >
              ✕
            </Button>
          )}
          <CreativeAssociateLogo
            className={cn("h-10 w-10", isCollapsed && "mx-auto h-8 w-8")}
          />
          {!isCollapsed && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                Creative Associate
              </p>
              <h1 className="mt-1 text-2xl font-semibold leading-tight">
                Mobility Control
              </h1>
              <p className="text-sm text-slate-400">QLD · NSW · VIC</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <nav className={cn("space-y-1 px-4", isCollapsed && "px-2")}>
          {visibleMenuItems.map((item) => {
            const isActive = currentPath === item.path
            return (
              <div key={item.path} className="group relative">
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 rounded-2xl px-4 py-4 text-sm font-medium text-slate-200 transition hover:bg-white/10",
                    isCollapsed && "justify-center px-0",
                    isActive &&
                      "bg-amber-400/90 text-slate-950 hover:bg-amber-400/90"
                  )}
                  title={item.label}
                >
                  <Link to={item.path} className="flex w-full items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && item.label}
                  </Link>
                </Button>
                {isCollapsed && (
                  <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 z-20 -translate-y-1/2 rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {!isCollapsed && (
          <div className="px-4 pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Today&apos;s coverage
            </p>
            <div className="mt-3 space-y-2">
              {focusHighlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-white">{item.label}</span>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-amber-200 hover:bg-white/20"
                  >
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200">
              <p className="font-semibold text-white">Need assistance?</p>
              <p className="text-slate-400">Ops desk · 1300 992 440</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-6 pt-2">
        <Button
          variant="ghost"
          className="hidden w-full items-center justify-center gap-2 rounded-2xl border border-white/10 text-xs uppercase tracking-wide text-slate-300 hover:bg-white/10 lg:flex"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? "Expand panel" : "Collapse panel"} {isCollapsed ? "▶" : "◀"}
        </Button>
      </div>
    </div>
  )
}

