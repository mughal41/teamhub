import * as React from "react";
import { useState } from "react";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your TeamHub dashboard to continue managing your team"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 border border-rose-200 text-rose-700 text-sm font-medium animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email Address"
          placeholder="e.g. davis@teamhub.corp"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="space-y-1">
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-200 text-brand focus:ring-brand cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
              Remember Me
            </span>
          </label>
          <a
            href="#"
            className="text-sm font-bold text-brand hover:text-brand-dark transition-colors underline underline-offset-4"
          >
            Forgot Password
          </a>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-bold shadow-lg shadow-brand/20 mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            "Log In"
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-brand hover:underline underline-offset-4"
          >
            Register now
          </Link>
        </p>

        <div className="rounded-xl border border-line bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Static demo accounts</p>
          <p className="mt-1">Admin: davis.levin@teamhub.corp</p>
          <p>Manager: marcus.brody@teamhub.corp</p>
          <p>Employee: olivia.chen@teamhub.corp</p>
          <p className="mt-1">Password: <span className="font-medium text-slate-700">TeamHub@123</span></p>
        </div>
      </form>
    </AuthLayout>
  );
}
