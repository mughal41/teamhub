import * as React from "react"
import { AuthLayout } from "../components/layout/AuthLayout"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to your TeamHub dashboard to continue managing your team"
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Input 
          label="Email Address" 
          placeholder="e.g. sarah.johnson@email.com" 
          type="email"
          required
        />
        <div className="space-y-1">
          <Input 
            label="Password" 
            placeholder="Create a strong password" 
            type="password"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-200 text-brand focus:ring-brand cursor-pointer" />
            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">Remember Me</span>
          </label>
          <a href="#" className="text-sm font-bold text-brand hover:text-brand-dark transition-colors underline underline-offset-4">Forgot Password</a>
        </div>

        <Link to="/">
          <Button className="w-full h-12 text-base font-bold shadow-lg shadow-brand/20 mt-2">Log In</Button>
        </Link>

        <p className="text-center text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="font-bold text-brand hover:underline underline-offset-4">Register now</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
