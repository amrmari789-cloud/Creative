import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function DashboardLayout({ children, currentPath = "/" }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileSidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden h-screen overflow-hidden lg:block">
        <Sidebar
          currentPath={currentPath}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 h-full w-72 transform overflow-y-auto bg-slate-950 transition duration-300 lg:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentPath={currentPath}
          isMobile
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleDesktopSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

