import * as React from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export function AppLayout({ children, title, breadcrumbs }: { children: React.ReactNode, title: string, breadcrumbs: { label: string, href?: string }[] }) {
  return (
    <div className="flex bg-surface min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:pl-64">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
