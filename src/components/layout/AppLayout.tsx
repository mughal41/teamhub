import * as React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export type Crumb = { label: string; href?: string };

type PageMeta = {
  title: string;
  breadcrumbs: Crumb[];
};

type PageMetaContextValue = {
  setMeta: (meta: PageMeta) => void;
};

const PageMetaContext = React.createContext<PageMetaContextValue | null>(null);

function metaEqual(a: PageMeta, b: PageMeta) {
  if (a.title !== b.title) return false;
  if (a.breadcrumbs.length !== b.breadcrumbs.length) return false;
  return a.breadcrumbs.every(
    (crumb, i) => crumb.label === b.breadcrumbs[i]?.label && crumb.href === b.breadcrumbs[i]?.href
  );
}

/**
 * Persistent authenticated shell. Sidebar/Header stay mounted across route
 * changes so navigation cannot freeze from remounting the whole chrome.
 */
export function AppShell() {
  const [meta, setMetaState] = React.useState<PageMeta>({
    title: "TeamHub",
    breadcrumbs: [{ label: "Dashboard" }],
  });

  const setMeta = React.useCallback((next: PageMeta) => {
    setMetaState((prev) => (metaEqual(prev, next) ? prev : next));
  }, []);

  const ctx = React.useMemo(() => ({ setMeta }), [setMeta]);

  return (
    <PageMetaContext.Provider value={ctx}>
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="admin-shell flex-1 lg:pl-64">
          <Header title={meta.title} breadcrumbs={meta.breadcrumbs} />
          <div className="space-y-6 p-6 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </PageMetaContext.Provider>
  );
}

/**
 * Pages keep calling AppLayout for title/breadcrumbs.
 * Inside AppShell it only publishes meta and renders children (no second sidebar).
 */
export function AppLayout({
  children,
  title,
  breadcrumbs,
}: {
  children: React.ReactNode;
  title: string;
  breadcrumbs: Crumb[];
}) {
  const ctx = React.useContext(PageMetaContext);
  const crumbsKey = breadcrumbs
    .map((c) => `${c.label}:${c.href ?? ""}`)
    .join("|");

  React.useEffect(() => {
    if (!ctx) return;
    ctx.setMeta({ title, breadcrumbs });
    // crumbsKey captures breadcrumb identity without depending on array reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, title, crumbsKey]);

  if (ctx) {
    return <>{children}</>;
  }

  // Fallback for any page rendered outside AppShell
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="admin-shell flex-1 lg:pl-64">
        <Header title={title} breadcrumbs={breadcrumbs} />
        <div className="space-y-6 p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
