import * as React from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export function AppLayout({ children, title, breadcrumbs }: { children: React.ReactNode, title: string, breadcrumbs: { label: string, href?: string }[] }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="admin-shell flex-1 lg:pl-64">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <div className="p-6 sm:p-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
