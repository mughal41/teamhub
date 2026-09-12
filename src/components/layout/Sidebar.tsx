import { cn } from "@/src/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import * as React from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getNavItemsForRole, type NavItem } from "@/src/lib/navigation";

export function Sidebar() {
  const location = useLocation();
  const { accessRole } = useAuth();
  const navigationConfig = React.useMemo(
    () => getNavItemsForRole(accessRole),
    [accessRole]
  );

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      navigationConfig.forEach((item) => {
        if (item.type !== "group") return;
        const isChildActive = item.children.some(
          (child) =>
            location.pathname === child.path ||
            (child.path !== "/" && location.pathname.startsWith(child.path))
        );
        if (isChildActive && !next[item.id]) {
          next[item.id] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [location.pathname, navigationConfig]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isPathActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(`${path}/`));

  const linkClass = (isActive: boolean) =>
    cn(
      "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
      isActive
        ? "bg-[#28C2A9] text-white shadow-sm font-bold"
        : "text-slate-600 hover:bg-[#F3F3F0] hover:text-slate-900"
    );

  const renderSingle = (item: Extract<NavItem, { type: "single" }>) => (
    <NavLink
      key={item.id}
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) => linkClass(isActive)}
    >
      {({ isActive }) => (
        <div className="flex items-center gap-3">
          <item.icon
            className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
            )}
          />
          {item.label}
        </div>
      )}
    </NavLink>
  );

  return (
    <aside className="fixed left-0 top-0 z-[60] hidden h-screen w-64 flex-col border-r border-[#E4E4E1] bg-white lg:flex">
      <div className="flex h-20 shrink-0 items-center px-8">
        <Link to="/" className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-[#28C2A9]"
          >
            <path d="M12 12C12 7 8 3 4 4C3 8 7 12 12 12Z" fill="currentColor" />
            <path d="M12 12C17 12 21 8 20 4C16 3 12 7 12 12Z" fill="currentColor" />
            <path d="M12 12C12 17 16 21 20 20C21 16 17 12 12 12Z" fill="currentColor" />
            <path d="M12 12C7 12 3 16 4 20C8 21 12 17 12 12Z" fill="currentColor" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-[#0E4D41]">TeamHub</span>
        </Link>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {navigationConfig.map((item) => {
          if (item.type === "single") return renderSingle(item);

          const isGroupOpen = !!openGroups[item.id];
          const isAnyChildActive = item.children.some((child) => isPathActive(child.path));

          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(item.id)}
                className={cn(
                  "group flex w-full select-none items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isAnyChildActive
                    ? "bg-[#F3F3F0] font-bold text-[#0E4D41]"
                    : "text-slate-600 hover:bg-[#F3F3F0] hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isAnyChildActive ? "text-[#28C2A9]" : "text-slate-400 group-hover:text-slate-900"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isGroupOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {isGroupOpen && (
                <div className="ml-5 space-y-1 border-l-2 border-[#E4E4E1] py-1 pl-6">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.path}
                      className={({ isActive }) =>
                        cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-all",
                          isActive
                            ? "bg-[#28C2A9] font-bold text-white"
                            : "text-slate-500 hover:bg-[#F3F3F0] hover:text-slate-900"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <child.icon
                            className={cn(
                              "h-4 w-4",
                              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                            )}
                          />
                          {child.label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mb-2 shrink-0 p-4">
        <div className="rounded-[16px] border border-[#d7e6c8] bg-[#E4F2D3] p-5">
          <h4 className="mb-2 text-sm font-bold text-[#0E4D41]">Level Up Your HR System</h4>
          <p className="mb-4 text-xs leading-relaxed text-[#4a5754]">
            TeamHub Pro gives you full control with advanced modules and extended layouts
          </p>
          <Link
            to={accessRole === "admin" ? "/settings/billing" : "/settings/personal-info"}
            className="flex h-9 w-full items-center justify-center rounded-lg bg-[#28C2A9] text-xs font-bold text-white transition-colors hover:bg-[#209f8a]"
          >
            {accessRole === "admin" ? "Get TeamHub Pro" : "Update profile"}
          </Link>
        </div>
      </div>
    </aside>
  );
}
