import * as React from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "@/src/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  CheckCircle2,
  Loader2,
  Check,
  X,
  UploadCloud,
  Info,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

type PersonalExtras = {
  dob: string;
  gender: string;
  phoneNumber: string;
  alternatePhone: string;
  residentialAddress: string;
  status: string;
  joinDate: string;
};

const DEFAULT_EXTRAS: PersonalExtras = {
  dob: "1992-04-18",
  gender: "prefer_not_to_say",
  phoneNumber: "+1 (415) 555-0142",
  alternatePhone: "",
  residentialAddress: "120 Market Street, Suite 400, San Francisco, CA 94105",
  status: "Full-time",
  joinDate: "Joined Jan 2024",
};

function extrasKey(userId: string) {
  return `db_personal_info:${userId}`;
}

function loadExtras(userId: string): PersonalExtras {
  const raw = localStorage.getItem(extrasKey(userId));
  if (!raw) return { ...DEFAULT_EXTRAS };
  try {
    return { ...DEFAULT_EXTRAS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_EXTRAS };
  }
}

function saveExtras(userId: string, extras: PersonalExtras) {
  localStorage.setItem(extrasKey(userId), JSON.stringify(extras));
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

export default function PersonalInformationPage() {
  const { user, updateProfile } = useAuth();
  const [extras, setExtras] = React.useState<PersonalExtras>(() =>
    user ? loadExtras(user.id) : { ...DEFAULT_EXTRAS }
  );

  const initialName = splitName(user?.name || "");
  const [firstName, setFirstName] = React.useState(initialName.firstName);
  const [lastName, setLastName] = React.useState(initialName.lastName);
  const [dob, setDob] = React.useState(extras.dob);
  const [gender, setGender] = React.useState(extras.gender);
  const [phoneNumber, setPhoneNumber] = React.useState(extras.phoneNumber);
  const [alternatePhone, setAlternatePhone] = React.useState(extras.alternatePhone);
  const [residentialAddress, setResidentialAddress] = React.useState(extras.residentialAddress);

  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [modalPreviewUrl, setModalPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const nextExtras = loadExtras(user.id);
    setExtras(nextExtras);
    const names = splitName(user.name);
    setFirstName(names.firstName);
    setLastName(names.lastName);
    setDob(nextExtras.dob);
    setGender(nextExtras.gender);
    setPhoneNumber(nextExtras.phoneNumber);
    setAlternatePhone(nextExtras.alternatePhone);
    setResidentialAddress(nextExtras.residentialAddress);
  }, [user?.id]);

  React.useEffect(() => {
    return () => {
      if (modalPreviewUrl) URL.revokeObjectURL(modalPreviewUrl);
    };
  }, [modalPreviewUrl]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  };

  const resetForm = () => {
    if (!user) return;
    const names = splitName(user.name);
    const next = loadExtras(user.id);
    setFirstName(names.firstName);
    setLastName(names.lastName);
    setDob(next.dob);
    setGender(next.gender);
    setPhoneNumber(next.phoneNumber);
    setAlternatePhone(next.alternatePhone);
    setResidentialAddress(next.residentialAddress);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || user.name;
    const nextExtras: PersonalExtras = {
      dob,
      gender,
      phoneNumber,
      alternatePhone,
      residentialAddress,
      status: extras.status || "Full-time",
      joinDate: extras.joinDate || "Joined Jan 2024",
    };
    try {
      await updateProfile({ name: fullName });
      saveExtras(user.id, nextExtras);
      setExtras(nextExtras);
      showToast("Personal information saved.");
    } catch (err: any) {
      showToast(err?.message || "Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const acceptFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB.");
      return;
    }
    if (modalPreviewUrl) URL.revokeObjectURL(modalPreviewUrl);
    setUploadedFile(file);
    setModalPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!user || !uploadedFile || !modalPreviewUrl) {
      showToast("Select an image first.");
      return;
    }
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      await updateProfile({ avatar: modalPreviewUrl });
      setShowPhotoModal(false);
      setUploadedFile(null);
      showToast("Profile photo updated.");
    } catch (err: any) {
      showToast(err?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const displayName = user?.name || "TeamHub User";
  const avatar = user?.avatar;

  return (
    <AppLayout
      title="Personal Information"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Personal Information" },
      ]}
    >
      <div className="w-full space-y-6">
        {toast ? (
          <div className="fixed right-6 top-24 z-[80] flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            {toast}
          </div>
        ) : null}

        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-24 w-24 rounded-2xl object-cover ring-2 ring-[#E4E4E1]"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#F3F3F0] text-[#0E4D41]">
                  <User className="h-10 w-10" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#28C2A9] text-white shadow-sm transition hover:bg-[#209f8a]"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
              <p className="mt-1 text-sm font-medium text-[#28C2A9]">{user?.roleTitle || "Team member"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span className="rounded-lg border border-[#E4E4E1] bg-[#F3F3F0] px-2.5 py-1">
                  {user?.employeeId || "—"}
                </span>
                <span className="rounded-lg border border-[#E4E4E1] bg-[#F3F3F0] px-2.5 py-1">
                  {extras.status}
                </span>
                <span className="rounded-lg border border-[#E4E4E1] bg-[#F3F3F0] px-2.5 py-1">
                  {extras.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSave}
            className="space-y-5 rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:col-span-2"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">Contact details</h3>
              <p className="mt-1 text-sm text-slate-500">
                Keep your personal profile up to date for HR and team directories.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={fieldClass}
                  required
                />
              </Field>
              <Field label="Last name">
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Date of birth">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Gender">
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={fieldClass}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </Field>
              <Field label="Work email">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={user?.email || ""}
                    readOnly
                    className={cn(fieldClass, "cursor-not-allowed bg-[#F3F3F0] pl-10 text-slate-500")}
                  />
                </div>
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={cn(fieldClass, "pl-10")}
                  />
                </div>
              </Field>
              <Field label="Alternate phone">
                <input
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  className={fieldClass}
                  placeholder="Optional"
                />
              </Field>
              <Field label="Residential address" className="sm:col-span-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    rows={3}
                    className={cn(fieldClass, "min-h-[96px] resize-none pl-10 pt-2.5")}
                  />
                </div>
              </Field>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E4E4E1] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="h-11 rounded-xl border border-[#E4E4E1] bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-[#F3F3F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#28C2A9] px-5 text-sm font-bold text-white hover:bg-[#209f8a] disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save changes
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4F2D3] text-[#0E4D41]">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Privacy</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Your personal details are visible to HR and your manager. Teammates only see your
                directory name and role.
              </p>
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="mt-4 text-sm font-bold text-[#28C2A9] hover:text-[#209f8a]"
              >
                View privacy note
              </button>
            </div>

            <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F3F0] text-slate-600">
                <Info className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Profile checklist</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "Photo uploaded",
                  "Phone number on file",
                  "Address completed",
                  "Work email verified",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#28C2A9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showPhotoModal ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Update photo</h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-[#F3F3F0] hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                acceptFile(e.dataTransfer.files?.[0] || null);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition",
                dragActive ? "border-[#28C2A9] bg-[#E4F2D3]/40" : "border-[#E4E4E1] bg-[#F3F3F0]"
              )}
            >
              {modalPreviewUrl ? (
                <img src={modalPreviewUrl} alt="Preview" className="mb-3 h-24 w-24 rounded-2xl object-cover" />
              ) : (
                <UploadCloud className="mb-3 h-8 w-8 text-[#28C2A9]" />
              )}
              <p className="text-sm font-semibold text-slate-800">Drop an image or click to browse</p>
              <p className="mt-1 text-xs text-slate-500">JPG or PNG · max 2MB</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0] || null)}
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="h-10 rounded-xl border border-[#E4E4E1] px-4 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUploading || !uploadedFile}
                onClick={handleUploadAvatar}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save photo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {privacyOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#E4E4E1] bg-white p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Privacy note</h3>
              <button type="button" onClick={() => setPrivacyOpen(false)} className="rounded-lg p-1.5 hover:bg-[#F3F3F0]">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              TeamHub stores your personal profile for employment operations. Contact details are used for
              payroll, leave, and emergency communication. You can request corrections anytime from HR.
            </p>
            <button
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="mt-5 h-10 rounded-xl bg-[#28C2A9] px-4 text-sm font-bold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const fieldClass =
  "h-11 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#28C2A9] focus:ring-1 focus:ring-[#28C2A9]";
