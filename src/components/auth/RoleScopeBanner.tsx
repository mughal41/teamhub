import * as React from "react";
import { Eye, Users, Building2, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  resolveDataScope,
  scopeLabel,
  ROLE_IDENTITY,
  type DataScope,
} from "../../lib/roleScope";
import type { ModuleKey } from "../../lib/rbac";
import { cn } from "@/src/lib/utils";

const ICONS: Record<DataScope, React.ComponentType<{ className?: string }>> = {
  own: User,
  team: Users,
  company: Building2,
  none: Eye,
};

export function RoleScopeBanner({
  module,
  className,
}: {
  module: ModuleKey;
  className?: string;
}) {
  const { user } = useAuth();
  if (!user) return null;

  const scope = resolveDataScope(user.roleId, module);
  const identity = ROLE_IDENTITY[user.roleId];
  const Icon = ICONS[scope];

  const detail =
    scope === "own"
      ? `Showing records for ${identity.employeeName}`
      : scope === "team"
        ? `Showing ${identity.employeeName} + ${identity.teamNames.length} team member(s)`
        : scope === "company"
          ? "Showing company-wide data"
          : "No records available for this role";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 text-xs",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 text-[#35BFA3] shrink-0" />
      <span className="font-bold text-[#0E4D41]">{user.roleLabel}</span>
      <span className="text-slate-300">·</span>
      <span className="font-semibold text-slate-600">{scopeLabel(scope)}</span>
      <span className="text-slate-300">·</span>
      <span className="text-slate-500 font-medium">{detail}</span>
    </div>
  );
}
