import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

export function Header({
  onOpenMobileSidebar,
  onToggleDesktopSidebar,
  isSidebarCollapsed,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <header className="flex flex-wrap items-center gap-2 border-b bg-white/85 px-3 py-2 backdrop-blur sm:px-4 sm:py-3 md:flex-nowrap md:gap-3 md:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-slate-200 text-lg text-slate-700 lg:hidden"
          onClick={onOpenMobileSidebar}
        >
          ☰
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden rounded-full border-slate-200 text-slate-600 hover:bg-amber-50 lg:flex"
          onClick={onToggleDesktopSidebar}
        >
          {isSidebarCollapsed ? "▶" : "◀"}
        </Button>
      </div>

      <div className="flex flex-1 items-center gap-2 md:gap-3">
        <Input
          placeholder="Search jobs, plates or inspectors…"
          className="flex-1 min-w-0 rounded-2xl bg-white/80 text-sm hidden sm:flex"
        />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl border border-slate-200 text-base text-slate-700 sm:hidden"
        >
          🔍
        </Button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="rounded-2xl hidden sm:flex">
          🔔
        </Button>
        <Button className="hidden rounded-2xl bg-amber-400 px-3 text-xs font-semibold text-slate-950 hover:bg-amber-400/90 sm:px-4 sm:text-sm md:inline-flex">
          Book check
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full">
              <Avatar className="h-11 w-11">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white text-slate-900 shadow-lg"
            align="end"
          >
            <div className="flex items-center gap-2 p-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.email || "No email"}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

