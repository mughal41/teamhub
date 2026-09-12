import * as React from "react";
import { useAuth } from "@/src/context/AuthContext";
import { roleLabel } from "@/src/lib/auth";
import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

/** Temporary landing for roles whose panels are not built yet (Employee). */
export default function RoleComingSoonPage() {
  const { user, accessRole, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F2D3] text-[#0E4D41]">
          <Construction className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {accessRole ? `${roleLabel(accessRole)} panel coming next` : "Panel coming soon"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          You&apos;re signed in as{" "}
          <span className="font-semibold text-slate-800">{user?.name || "this account"}</span>
          {accessRole ? ` (${roleLabel(accessRole)})` : ""}. Admin and Manager panels are ready —
          the Employee self-service panel will be built next.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = "/login";
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#28C2A9] px-5 text-sm font-bold text-white transition-colors hover:bg-[#209f8a]"
          >
            Switch account
          </button>
          <Link
            to="/login"
            onClick={() => {
              void logout();
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Back to login
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Demo password for all roles: <span className="font-medium text-slate-600">TeamHub@123</span>
        </p>
      </div>
    </div>
  );
}
