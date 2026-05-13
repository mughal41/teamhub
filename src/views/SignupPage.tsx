import * as React from "react"
import { AuthLayout } from "../components/layout/AuthLayout"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Join TeamHub to streamline your HR experience"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input 
          label="Full Name" 
          placeholder="e.g. Sarah Johnson" 
          required
        />
        <Input 
          label="Email Address" 
          placeholder="e.g. sarah.johnson@email.com" 
          type="email"
          required
        />
        <Input 
          label="Password" 
          placeholder="Create a strong password" 
          type="password"
          required
        />
        <Input 
          label="Confirm Password" 
          placeholder="Re-enter your password" 
          type="password"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Employment Type</label>
              <div className="relative">
                <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand outline-none cursor-pointer">
                  <option disabled selected>Select employment type</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
           </div>
           
           <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Department</label>
              <div className="relative">
                <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand outline-none cursor-pointer">
                  <option disabled selected>Choose your department</option>
                  <option>Product Design</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
           </div>
        </div>

        <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-slate-700">Work Model</label>
            <div className="relative">
              <select className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand outline-none cursor-pointer">
                <option disabled selected>Select your work model</option>
                <option>On-Site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        </div>

        <Button className="w-full h-12 text-base font-bold shadow-lg shadow-brand/20 mt-4">Sign Up</Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-bold text-brand hover:underline underline-offset-4">Login here</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
