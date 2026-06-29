import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  Building, 
  UploadCloud, 
  MapPin, 
  Globe2, 
  Palette, 
  Check, 
  Mail, 
  Phone,
  Workflow,
  Sparkles,
  Link,
  Briefcase,
  X,
  Info,
  Loader2
} from "lucide-react"

/*
Organization Profile JSON Data Format Requirement:
-------------------------------------------------+
The Organization Profile settings page expects database information in the following JSON format.
You can read/write this model through localStorage under "db_organization_profile".

{
  "companyName": "TeamHub Technologies, Inc.",
  "legalName": "TeamHub Tech Private Limited",
  "regNo": "REG-2025-9988112",
  "industry": "Technology & Softwares",
  "currencyPref": "USD",
  "primaryColor": "#006B5F",
  "secondaryColor": "#D4E7D8",
  "tagline": "Empowering teams through transparent management and automated HR workflows.",
  "address": "500 Howard Street, Suite 300",
  "city": "San Francisco",
  "state": "CA",
  "zip": "94105",
  "country": "United States of America",
  "phone": "+1 (415) 555-0199",
  "email": "contact@teamhubtech.io",
  "linkedin": "https://linkedin.com/company/teamhub-tech",
  "twitter": "https://twitter.com/teamhub_tech",
  "website": "https://teamhubtech.io",
  "logoPreview": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120"
}
*/

export default function OrganizationProfilePage() {
  // Read saved data or fall back to completely empty placeholders and states
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem("db_organization_profile")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {}
    }
    return {
      companyName: "",
      legalName: "",
      regNo: "",
      industry: "",
      currencyPref: "USD",
      primaryColor: "",
      secondaryColor: "",
      tagline: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
      linkedin: "",
      twitter: "",
      website: "",
      logoPreview: ""
    }
  })

  // Company details info
  const [companyName, setCompanyName] = useState(profileData.companyName || "")
  const [legalName, setLegalName] = useState(profileData.legalName || "")
  const [regNo, setRegNo] = useState(profileData.regNo || "")
  const [industry, setIndustry] = useState(profileData.industry || "")
  const [currencyPref, setCurrencyPref] = useState(profileData.currencyPref || "USD")

  // Brand details
  const [primaryColor, setPrimaryColor] = useState(profileData.primaryColor || "#006B5F")
  const [secondaryColor, setSecondaryColor] = useState(profileData.secondaryColor || "#D4E7D8")
  const [tagline, setTagline] = useState(profileData.tagline || "")

  // Headquarters
  const [address, setAddress] = useState(profileData.address || "")
  const [city, setCity] = useState(profileData.city || "")
  const [state, setState] = useState(profileData.state || "")
  const [zip, setZip] = useState(profileData.zip || "")
  const [country, setCountry] = useState(profileData.country || "")
  const [phone, setPhone] = useState(profileData.phone || "")
  const [email, setEmail] = useState(profileData.email || "")

  // Socials
  const [linkedin, setLinkedin] = useState(profileData.linkedin || "")
  const [twitter, setTwitter] = useState(profileData.twitter || "")
  const [website, setWebsite] = useState(profileData.website || "")

  // Status indicators & Custom Upload Logo Modal states
  const [isSaving, setIsSaving] = useState(false)
  const [successToast, setSuccessToast] = useState(false)
  const [logoPreview, setLogoPreview] = useState(profileData.logoPreview || "")
  const [showUploadLogoModal, setShowUploadLogoModal] = useState(false)
  const [uploadedLogoFile, setUploadedLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [dragActiveLogo, setDragActiveLogo] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      companyName,
      legalName,
      regNo,
      industry,
      currencyPref,
      primaryColor,
      secondaryColor,
      tagline,
      address,
      city,
      state,
      zip,
      country,
      phone,
      email,
      linkedin,
      twitter,
      website,
      logoPreview
    }
    
    localStorage.setItem("db_organization_profile", JSON.stringify(payload))
    localStorage.setItem("currency_preference", currencyPref)
    window.dispatchEvent(new Event("currency_change"))
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSuccessToast(true)
      setTimeout(() => {
        setSuccessToast(false)
      }, 3500)
    }, 1100)
  }

  const handleDiscard = () => {
    // Clear out profile inputs to default blank entries/empty states
    setCompanyName("")
    setLegalName("")
    setRegNo("")
    setIndustry("")
    setCurrencyPref("USD")
    setPrimaryColor("#006B5F")
    setSecondaryColor("#D4E7D8")
    setTagline("")
    setAddress("")
    setCity("")
    setState("")
    setZip("")
    setCountry("")
    setPhone("")
    setEmail("")
    setLinkedin("")
    setTwitter("")
    setWebsite("")
    setLogoPreview("")
    localStorage.removeItem("db_organization_profile")
  }

  // Restore sample data for review/testing on click
  const restoreDemoProfile = () => {
    setCompanyName("TeamHub Technologies, Inc.")
    setLegalName("TeamHub Tech Private Limited")
    setRegNo("REG-2025-9988112")
    setIndustry("Technology & Softwares")
    setCurrencyPref("USD")
    setPrimaryColor("#006B5F")
    setSecondaryColor("#D4E7D8")
    setTagline("Empowering teams through transparent management and automated HR workflows.")
    setAddress("500 Howard Street, Suite 300")
    setCity("San Francisco")
    setState("CA")
    setZip("94105")
    setCountry("United States of America")
    setPhone("+1 (415) 555-0199")
    setEmail("contact@teamhubtech.io")
    setLinkedin("https://linkedin.com/company/teamhub-tech")
    setTwitter("https://twitter.com/teamhub_tech")
    setWebsite("https://teamhubtech.io")
    setLogoPreview("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120")
  }

  // File logo upload simulated
  const triggerLogoUpload = () => {
    const urls = [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120"
    ]
    const randomUrl = urls[Math.floor(Math.random() * urls.length)]
    setLogoPreview(randomUrl)
    setSuccessToast(true)
    setTimeout(() => setSuccessToast(false), 2000)
  }

  return (
    <AppLayout
      title="Organization Profile"
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" },
        { label: "Organization Profile" }
      ]}
    >
      <div className="mx-auto w-full max-w-7xl pb-28 animate-fade-in duration-300 relative">
        
        {/* Floating Toast notification */}
        {successToast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-full px-6 py-3.5 flex items-center gap-3.5 shadow-2xl z-50 animate-bounce">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold tracking-wide">Organization settings successfully updated!</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-slate-500 font-medium font-sans">
            Customize corporate identity information, color schemes, address markers, and contact handles.
          </p>
          {!companyName && (
            <button
              type="button"
              onClick={restoreDemoProfile}
              className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-[#006b5f] hover:text-[#005047] border border-slate-200 rounded-xl px-4 py-2 cursor-pointer transition-colors shrink-0"
            >
              Restore Placeholder Corporate Info
            </button>
          )}
        </div>

        {/* Main profile form columns wrapper */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            
            {/* Section 1: Company Details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                  <Building className="h-5.5 w-5.5 text-brand" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Company Details</h3>
                  <p className="text-xs text-slate-400 font-medium">Legal designation and regulatory records</p>
                </div>
              </div>

              {/* Logo block upload left + inputs right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                 {/* Logo layout */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 text-center gap-3">
                  <div 
                    onClick={() => { setShowUploadLogoModal(true); setUploadedLogoFile(null); setLogoPreviewUrl(null); }}
                    className="relative w-24 h-24 rounded-2xl border border-slate-100 bg-white shadow-2xs overflow-hidden flex items-center justify-center group cursor-pointer"
                  >
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Brand abstract mark" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 font-extrabold text-xs p-2">
                        <Building className="h-7 w-7 text-slate-350 mb-1" />
                        <span>No Logo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white uppercase">Replace</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Organization Logo</h5>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Recommended size 400x400 JPG or PNG</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setShowUploadLogoModal(true); setUploadedLogoFile(null); setLogoPreviewUrl(null); }}
                    className="mt-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-brand rounded-lg text-[10px] font-bold text-slate-600 hover:text-brand-dark flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <UploadCloud className="h-3 w-3" />
                    Update Logo
                  </button>
                </div>

                {/* Form fields */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-505 text-slate-500">Company Name</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-505 text-slate-500">Legal Entity Name</label>
                    <input 
                      type="text" 
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-505 text-slate-500">Registration Number</label>
                    <input 
                      type="text" 
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-501 text-slate-500">Industry Sector</label>
                    <select 
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand class-select rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all"
                    >
                      <option value="Technology & Softwares">Technology & Softwares</option>
                      <option value="Finance & Venture Capital">Finance & Venture Capital</option>
                      <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Currency Preference</label>
                    <select 
                      value={currencyPref}
                      onChange={(e) => setCurrencyPref(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand class-select rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all"
                    >
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="PKR">Pakistani Rupee (PKR / Rs.)</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: Brand Identity details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Palette className="h-5.5 w-5.5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Brand Identity</h3>
                  <p className="text-xs text-slate-400 font-medium">Configure layout themes, primary styling colours and tagline statement</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Primary Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Primary Brand Color</label>
                  <div className="flex gap-2.5 items-center">
                    <div 
                      className="w-11 h-11 rounded-xl border border-slate-200 shrink-0 shadow-2xs cursor-pointer transition-transform hover:scale-105" 
                      style={{ backgroundColor: primaryColor }}
                      onClick={() => {
                        const colors = ["#006B5F", "#6366F1", "#3B82F6", "#06B6D4", "#10B981"]
                        const curIdx = colors.indexOf(primaryColor)
                        const nextColor = colors[(curIdx + 1) % colors.length]
                        setPrimaryColor(nextColor)
                      }}
                      title="Click to quickly toggle preset colors"
                    />
                    <input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold font-mono text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Secondary Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Secondary Brand Accent Color</label>
                  <div className="flex gap-2.5 items-center">
                    <div 
                      className="w-11 h-11 rounded-xl border border-slate-200 shrink-0 shadow-2xs cursor-pointer transition-transform hover:scale-105" 
                      style={{ backgroundColor: secondaryColor }}
                      onClick={() => {
                        const colors = ["#D4E7D8", "#E0E7FF", "#DBEAFE", "#ECFDF5", "#F1F5F9"]
                        const curIdx = colors.indexOf(secondaryColor)
                        const nextColor = colors[(curIdx + 1) % colors.length]
                        setSecondaryColor(nextColor)
                      }}
                      title="Click to toggle preset light gradients"
                    />
                    <input 
                      type="text" 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold font-mono text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Company Tagline */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Tagline / Mission Statement</label>
                  <textarea 
                    rows={2}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-100 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all resize-none"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Provides metadata description tags for report summaries and email headings layouts.</p>
                </div>

              </div>
            </div>

            {/* Section 3: Headquarters Location details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-850 flex items-center justify-center shrink-0">
                  <MapPin className="h-5.5 w-5.5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Headquarters Location</h3>
                  <p className="text-xs text-slate-400 font-medium">Physical coordinates for legal invoicing, tax records, and contact rosters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                <div className="sm:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Street Address</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">City</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">State / Province</label>
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Country</label>
                  <input 
                    type="text" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Primary Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Social Links & Info side block (Span 4) */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            
            {/* Section 4: Social Links (Optional) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-50">
                <Globe2 className="h-4.5 w-4.5 text-slate-400" />
                <span>Social Links & Handles</span>
              </h3>

              <div className="space-y-4">
                
                {/* LinkedIn Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">LinkedIn URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-blue-650 text-indigo-650 font-sans">in</span>
                    <input 
                      type="url" 
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Twitter Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Twitter X URL</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-705 font-sans">X</span>
                    <input 
                      type="url" 
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Website Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Website URL</label>
                  <div className="relative">
                    <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="url" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-brand rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Stats Bento block */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-6 flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-650 text-brand" />
                Integration Status
              </h4>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-teal-100/50">
                  <span className="text-slate-500 font-bold">HR API Syncing</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-teal-100/50">
                  <span className="text-slate-500 font-bold">SMTP Mail Server</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">VERIFIED</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-teal-100/50">
                  <span className="text-slate-500 font-bold">Subdomain Route</span>
                  <span className="font-mono text-slate-700 font-bold">teamhub.app/tech</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-500 font-bold">Last backup</span>
                  <span className="text-slate-600 font-semibold font-mono">Today, 03:00 AM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Sticky Footer Bar */}
          <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/90 backdrop-blur-md border-t border-slate-100 px-8 py-4.5 flex justify-end gap-4 z-40">
            <button 
              type="button" 
              onClick={handleDiscard}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-bold active:scale-95 transition-all cursor-pointer"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-sm font-bold shadow-md shadow-brand/10 hover:shadow-brand/20 transition-all cursor-pointer flex items-center justify-center min-w-[130px]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>

      </div>

      {/* Upload Logo Modal Overlay */}
      {showUploadLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen filter click blocker */}
          <div 
            onClick={() => { if (!isUploadingLogo) setShowUploadLogoModal(false); }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200 z-10">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Upload Logo</h3>
              <button 
                type="button"
                disabled={isUploadingLogo}
                onClick={() => setShowUploadLogoModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Preview Section */}
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 self-start">Current Logo</p>
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-md p-1 bg-white mb-2 flex items-center justify-center">
                  <img 
                    src={logoPreviewUrl || logoPreview} 
                    alt="Logo Preview" 
                    className="w-20 h-20 object-contain rounded-lg" 
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium">JPG, PNG or SVG. Max size 2MB.</p>
              </div>

              {/* Drag & Drop Area */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActiveLogo(true); }}
                onDragLeave={() => setDragActiveLogo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveLogo(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    setUploadedLogoFile(file);
                    setLogoPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                onClick={() => {
                  document.getElementById("logo-upload-input")?.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group text-center ${
                  dragActiveLogo 
                    ? "border-[#006b5f] bg-[#d4e7d8]/30" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-[#d4e7d8]/20 hover:border-[#006b5f]/50"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#d4e7d8]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-[#006b5f]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-800">
                    {uploadedLogoFile ? uploadedLogoFile.name : "Drag and drop your logo here"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {uploadedLogoFile ? `${(uploadedLogoFile.size / 1024).toFixed(1)} KB` : <>or <span className="text-[#006b5f] font-bold">browse files</span> from your computer</>}
                  </p>
                </div>
                <input 
                  type="file" 
                  id="logo-upload-input" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setUploadedLogoFile(file);
                      setLogoPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden" 
                />
              </div>

              {/* Guidance Note */}
              <div className="bg-[#e8e2d4]/50 border border-[#cbc6b9]/40 p-3.5 rounded-xl flex gap-3 text-[#1d1c13]">
                <Info className="h-5 w-5 text-[#49473d] shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                  Logos help your teammates identify your brand. Please upload a high resolution icon with a clean or transparent background.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button"
                disabled={isUploadingLogo}
                onClick={() => setShowUploadLogoModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={isUploadingLogo}
                onClick={() => {
                  setIsUploadingLogo(true);
                  setTimeout(() => {
                    setIsUploadingLogo(false);
                    if (logoPreviewUrl) {
                      setLogoPreview(logoPreviewUrl);
                    } else {
                      // fallback random brand logo key
                      setLogoPreview("https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=120");
                    }
                    setShowUploadLogoModal(false);
                    setSuccessToast(true);
                    setTimeout(() => setSuccessToast(false), 3000);
                  }, 1200);
                }}
                className="px-6 py-2.5 bg-[#006b5f] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#005047] shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {isUploadingLogo ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
