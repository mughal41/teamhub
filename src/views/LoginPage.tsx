import * as React from "react";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, X, Loader2, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  // Form input states (clean authentic initial values per policy — zero hardcoded credentials)
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = React.useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = React.useState<string>("");
  const [forgotSent, setForgotSent] = React.useState<boolean>(false);
  const [forgotLoading, setForgotLoading] = React.useState<boolean>(false);

  // Handle Login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your corporate email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    // Simulate authentic authentication verification
    setTimeout(() => {
      setIsLoading(false);
      // Persist active session in localStorage
      localStorage.setItem(
        "teamhub_auth_session",
        JSON.stringify({
          email: email.trim(),
          role: email.includes("admin") ? "HR Administrator" : "Staff Member",
          loggedInAt: new Date().toISOString(),
          rememberMe,
        })
      );
      // Navigate to main application dashboard
      navigate("/");
    }, 600);
  };

  return (
    <AuthLayout
      heroTitle="Welcome to TeamHub"
      heroSubtitle="Manage your HR tasks smarter, faster, and easier — all in one place"
      formTitle="Welcome Back"
      formSubtitle="Enter your email and password to access your account"
      showLogoInForm={true}
    >
      <form className="w-full space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-[10px] bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Email Address */}
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="login-email"
            className="block text-sm font-semibold text-[#111827]"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. name@company.com"
              required
              autoComplete="email"
              className="w-full h-12 px-4 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#35BFA3] focus:ring-2 focus:ring-[#35BFA3]/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-[#111827]"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full h-12 pl-4 pr-11 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#35BFA3] focus:ring-2 focus:ring-[#35BFA3]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5E1] text-[#35BFA3] focus:ring-[#35BFA3] cursor-pointer accent-[#35BFA3]"
            />
            <span className="text-sm font-medium text-[#64748B] group-hover:text-[#111827] transition-colors">
              Remember Me
            </span>
          </label>
          <button
            type="button"
            onClick={() => {
              setForgotEmail(email);
              setForgotSent(false);
              setIsForgotModalOpen(true);
            }}
            className="text-sm font-semibold text-[#35BFA3] hover:text-[#2da88f] transition-colors cursor-pointer focus:outline-none focus:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Log In Button — Exact 48px height, #35BFA3, rounded-[10px] */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-[10px] bg-[#35BFA3] hover:bg-[#2da88f] active:bg-[#259b83] text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#35BFA3]/40"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>

        {/* Footer Navigation */}
        <p className="text-center text-sm text-[#64748B] pt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-[#35BFA3] hover:text-[#2da88f] hover:underline underline-offset-4 transition-colors"
          >
            Register now
          </Link>
        </p>
      </form>

      {/* =========================================================================
          FORGOT PASSWORD MODAL DIALOG
          ========================================================================= */}
      {isForgotModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white rounded-[16px] shadow-2xl border border-[#E2E8F0] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#111827]">Reset Password</h3>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:text-[#111827] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#35BFA3] mx-auto" />
                <h4 className="text-base font-bold text-[#111827]">
                  Recovery Email Dispatched
                </h4>
                <p className="text-sm text-[#64748B]">
                  Instructions have been sent to{" "}
                  <span className="font-semibold text-[#111827]">{forgotEmail}</span> if an active corporate profile exists.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full mt-4 h-11 rounded-[10px] bg-[#35BFA3] hover:bg-[#2da88f] text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!forgotEmail) return;
                  setForgotLoading(true);
                  setTimeout(() => {
                    setForgotLoading(false);
                    setForgotSent(true);
                  }, 800);
                }}
                className="space-y-4"
              >
                <p className="text-sm text-[#64748B]">
                  Enter your registered work email address below to receive password recovery instructions.
                </p>
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-semibold text-[#111827] mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. name@company.com"
                    required
                    className="w-full h-11 px-3.5 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm focus:outline-none focus:border-[#35BFA3] focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 h-11 rounded-[10px] border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] font-medium text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="flex-1 h-11 rounded-[10px] bg-[#35BFA3] hover:bg-[#2da88f] text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
