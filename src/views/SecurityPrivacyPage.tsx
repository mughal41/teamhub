import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Laptop,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  X,
  Check,
  Clock,
  Download,
  QrCode,
  Loader2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

type Device = {
  id: number;
  name: string;
  os: string;
  location: string;
  lastActive: string;
  type: "laptop" | "phone";
  current?: boolean;
};

type LoginRow = {
  id: string;
  device: string;
  location: string;
  time: string;
  status: "SUCCESS" | "FAILED";
};

type SecurityState = {
  isTwoFactorActive: boolean;
  profileVisibility: boolean;
  dataSharing: boolean;
  passwordUpdatedAt: string;
  activeDevices: Device[];
  loginHistory: LoginRow[];
  backupCodes?: string[];
};

function storageKey(userId: string) {
  return `db_security_settings:${userId}`;
}

function seedSecurity(): SecurityState {
  return {
    isTwoFactorActive: false,
    profileVisibility: true,
    dataSharing: false,
    passwordUpdatedAt: "Never updated",
    activeDevices: [
      {
        id: 1,
        name: "This browser",
        os: "Chrome · Linux",
        location: "San Francisco, CA",
        lastActive: "Active now",
        type: "laptop",
        current: true,
      },
      {
        id: 2,
        name: "iPhone 15",
        os: "Safari · iOS 17",
        location: "San Francisco, CA",
        lastActive: "2 hours ago",
        type: "phone",
      },
    ],
    loginHistory: [
      {
        id: "l1",
        device: "Chrome on Linux",
        location: "San Francisco, USA",
        time: "Just now",
        status: "SUCCESS",
      },
      {
        id: "l2",
        device: "Safari on iPhone",
        location: "San Francisco, USA",
        time: "Yesterday, 6:12 PM",
        status: "SUCCESS",
      },
      {
        id: "l3",
        device: "Unknown Windows device",
        location: "Berlin, DE",
        time: "Mar 02, 8:41 AM",
        status: "FAILED",
      },
    ],
  };
}

function loadSecurity(userId: string): SecurityState {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) {
    const seeded = seedSecurity();
    localStorage.setItem(storageKey(userId), JSON.stringify(seeded));
    return seeded;
  }
  try {
    return { ...seedSecurity(), ...JSON.parse(raw) };
  } catch {
    return seedSecurity();
  }
}

function saveSecurity(userId: string, data: SecurityState) {
  localStorage.setItem(storageKey(userId), JSON.stringify(data));
}

export default function SecurityPrivacyPage() {
  const { user, changePassword } = useAuth();
  const [data, setData] = React.useState<SecurityState>(() =>
    user ? loadSecurity(user.id) : seedSecurity()
  );
  const [toast, setToast] = React.useState("");
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [twoFaOpen, setTwoFaOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [twoFaCode, setTwoFaCode] = React.useState("");
  const [currentPass, setCurrentPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [passError, setPassError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    setData(loadSecurity(user.id));
  }, [user?.id]);

  const persist = (next: SecurityState) => {
    setData(next);
    if (user) saveSecurity(user.id, next);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  };

  const passwordStrength = React.useMemo(() => {
    let score = 0;
    if (newPass.length >= 8) score += 1;
    if (/[A-Z]/.test(newPass)) score += 1;
    if (/[0-9]/.test(newPass)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPass)) score += 1;
    return score;
  }, [newPass]);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    if (newPass !== confirmPass) {
      setPassError("New passwords do not match.");
      return;
    }
    if (passwordStrength < 3) {
      setPassError("Use 8+ chars with upper case, a number, and a symbol.");
      return;
    }
    setBusy(true);
    try {
      await changePassword(currentPass, newPass);
      const next = {
        ...data,
        passwordUpdatedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      persist(next);
      setPasswordOpen(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      showToast("Password updated successfully.");
    } catch (err: any) {
      setPassError(err?.message || "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  const enableTwoFa = () => {
    if (twoFaCode.trim().length !== 6) {
      showToast("Enter the 6-digit authenticator code.");
      return;
    }
    const codes = Array.from({ length: 6 }, () =>
      Math.random().toString(36).slice(2, 6).toUpperCase()
    );
    persist({
      ...data,
      isTwoFactorActive: true,
      backupCodes: codes,
    });
    setTwoFaOpen(false);
    setTwoFaCode("");
    showToast("Two-factor authentication enabled.");
  };

  const disableTwoFa = () => {
    persist({ ...data, isTwoFactorActive: false, backupCodes: [] });
    showToast("Two-factor authentication turned off.");
  };

  const unlinkDevice = (id: number) => {
    persist({
      ...data,
      activeDevices: data.activeDevices.filter((d) => d.id !== id),
    });
    showToast("Device signed out.");
  };

  const exportHistory = () => {
    const rows = [
      "device,location,time,status",
      ...data.loginHistory.map((r) => `${r.device},${r.location},${r.time},${r.status}`),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teamhub-login-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Login history exported.");
  };

  const flushSecurity = () => {
    const reset = seedSecurity();
    persist(reset);
    showToast("Security preferences reset.");
  };

  return (
    <AppLayout
      title="Account Settings"
      breadcrumbs={[{ label: "Settings" }, { label: "Account Settings" }]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="fixed right-6 top-24 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        ) : null}

        <div className="admin-panel p-5">
          <p className="text-sm text-slate-500">
            Signed in as <span className="font-semibold text-slate-800">{user?.email}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Manage password, two-factor authentication, sessions, and privacy preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="admin-panel p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Password</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Last updated: {data.passwordUpdatedAt}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPasswordOpen(true)}
              className="h-11 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white hover:bg-[#209f8a]"
            >
              Change password
            </button>
          </section>

          <section className="admin-panel p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-700">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Two-factor authentication</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {data.isTwoFactorActive ? "Enabled with authenticator app" : "Not enabled yet"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (data.isTwoFactorActive ? disableTwoFa() : setTwoFaOpen(true))}
                className={cn(
                  "relative h-7 w-12 rounded-full transition",
                  data.isTwoFactorActive ? "bg-[#28C2A9]" : "bg-slate-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition",
                    data.isTwoFactorActive ? "left-5" : "left-0.5"
                  )}
                />
              </button>
            </div>
            {!data.isTwoFactorActive ? (
              <button
                type="button"
                onClick={() => setTwoFaOpen(true)}
                className="h-10 rounded-xl border border-line px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
              >
                Set up authenticator
              </button>
            ) : (
              <p className="text-xs text-slate-500">
                Keep your backup codes somewhere safe. You can regenerate them by disabling and
                re-enabling 2FA.
              </p>
            )}
          </section>
        </div>

        <section className="admin-panel p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Privacy preferences</h3>
              <p className="text-sm text-slate-500">Control what others can see about you.</p>
            </div>
          </div>
          <div className="space-y-3">
            <ToggleRow
              title="Show me in company directory"
              description="Teammates can find your name, role, and work email."
              checked={data.profileVisibility}
              onChange={(v) => persist({ ...data, profileVisibility: v })}
            />
            <ToggleRow
              title="Share anonymous product diagnostics"
              description="Help TeamHub improve reliability with non-personal usage data."
              checked={data.dataSharing}
              onChange={(v) => persist({ ...data, dataSharing: v })}
            />
          </div>
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="mt-4 text-sm font-bold text-[#28C2A9]"
          >
            Read privacy summary
          </button>
        </section>

        <section className="admin-panel p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-700">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Active sessions</h3>
              <p className="text-sm text-slate-500">Devices currently signed into your account.</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.activeDevices.map((device) => (
              <div
                key={device.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-[#F3F3F0]/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                    {device.type === "phone" ? (
                      <Smartphone className="h-5 w-5" />
                    ) : (
                      <Laptop className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {device.name}
                      {device.current ? (
                        <span className="ml-2 rounded-md bg-[#E4F2D3] px-1.5 py-0.5 text-[10px] font-bold text-[#0E4D41]">
                          This device
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">
                      {device.os} · {device.location} · {device.lastActive}
                    </p>
                  </div>
                </div>
                {!device.current ? (
                  <button
                    type="button"
                    onClick={() => unlinkDevice(device.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Login history</h3>
                <p className="text-sm text-slate-500">Recent sign-in attempts on your account.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={exportHistory}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] bg-white text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-semibold">Device</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">When</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.loginHistory.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.device}</td>
                    <td className="px-4 py-3 text-slate-500">{row.location}</td>
                    <td className="px-4 py-3 text-slate-500">{row.time}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-md px-2 py-1 text-[11px] font-bold",
                          row.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        )}
                      >
                        {row.status === "SUCCESS" ? "Success" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Reset security preferences</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Clears sessions, history seeds, and privacy toggles back to defaults for this demo.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={flushSecurity}
              className="h-10 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100"
            >
              Reset now
            </button>
          </div>
        </section>
      </div>

      {passwordOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={submitPassword}
            className="w-full max-w-md admin-panel p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Change password</h3>
              <button type="button" onClick={() => setPasswordOpen(false)} className="rounded-lg p-1.5 hover:bg-[#F3F3F0]">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            {passError ? (
              <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {passError}
              </div>
            ) : null}
            <div className="space-y-3">
              <PassField
                label="Current password"
                value={currentPass}
                onChange={setCurrentPass}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
              />
              <PassField
                label="New password"
                value={newPass}
                onChange={setNewPass}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
              />
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      passwordStrength > i ? "bg-[#28C2A9]" : "bg-[#E4E4E1]"
                    )}
                  />
                ))}
              </div>
              <PassField
                label="Confirm new password"
                value={confirmPass}
                onChange={setConfirmPass}
                show={false}
                onToggle={() => undefined}
                hideToggle
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#28C2A9] text-sm font-bold text-white disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Update password
            </button>
          </form>
        </div>
      ) : null}

      {twoFaOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md admin-panel p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Enable 2FA</h3>
              <button type="button" onClick={() => setTwoFaOpen(false)} className="rounded-lg p-1.5 hover:bg-[#F3F3F0]">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="mb-4 flex flex-col items-center rounded-2xl border border-line bg-[#F3F3F0] p-6">
              <QrCode className="mb-3 h-16 w-16 text-[#0E4D41]" />
              <p className="text-center text-sm text-slate-600">
                Scan with Google Authenticator or Authy, then enter the 6-digit code.
              </p>
              <p className="mt-2 rounded-lg bg-white px-3 py-1 font-mono text-xs font-bold text-slate-700">
                TEAMHUB-DEMO-2FA
              </p>
            </div>
            <input
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              className="h-11 w-full rounded-xl border border-line px-3 text-center font-mono text-lg tracking-[0.3em] outline-none focus:border-[#28C2A9]"
            />
            <button
              type="button"
              onClick={enableTwoFa}
              className="mt-4 h-11 w-full rounded-xl bg-[#28C2A9] text-sm font-bold text-white"
            >
              Confirm and enable
            </button>
          </div>
        </div>
      ) : null}

      {privacyOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg admin-panel p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Privacy summary</h3>
              <button type="button" onClick={() => setPrivacyOpen(false)} className="rounded-lg p-1.5 hover:bg-[#F3F3F0]">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              TeamHub uses account security logs to protect your workspace. Directory visibility only
              shares your work identity with teammates. Diagnostics never include document contents or
              payroll amounts.
            </p>
            <button
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="mt-5 h-10 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-[#F3F3F0]/50 p-4">
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-[#28C2A9]" : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function PassField({
  label,
  value,
  onChange,
  show,
  onToggle,
  hideToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  hideToggle?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-line px-3 pr-10 text-sm outline-none focus:border-[#28C2A9]"
          required
        />
        {!hideToggle ? (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
    </label>
  );
}
