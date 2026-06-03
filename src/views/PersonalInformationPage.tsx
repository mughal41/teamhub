import * as React from "react"
import { useState } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Sparkles,
  Loader2,
  Check,
  X,
  UploadCloud,
  Info
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export default function PersonalInformationPage() {
  // Form input states
  const [firstName, setFirstName] = useState("Davis")
  const [lastName, setLastName] = useState("Levin")
  const [dob, setDob] = useState("1988-06-15")
  const [gender, setGender] = useState("male")
  const [emailAddress, setEmailAddress] = useState("davis.levin@teamhub.com")
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 0123-4567")
  const [alternatePhone, setAlternatePhone] = useState("")
  const [residentialAddress, setResidentialAddress] = useState("1284 Corporate Way, Suite 500, San Francisco, CA 94105")

  // Modal and custom photo states
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [profileImage, setProfileImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuD0GyaqVXZ2fIAdTO1u2lUhQBwlzFYwOIj2ZSzjPKQXolxfRjIeX4EfcnRfCCXnMklI51Ope-xko7Zz3WDlmORgV9tn3fqWixj_mLAOykp6niaYYML2YXqd1xB2GkHzfUqVcXOuP78Ji_H9tmspntehm9v_P7m2TX_gX1SQ7Cchk2g9yMN5cdBUjXHs5BR3VxmYrkPCgQv1GQ0w69SwmlUUGQ3OwmiaLVEX2hghjj8kVcp6tMfwAaVPxHlzJDwNgVcRg95mXToSuNk")
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [modalPreviewUrl, setModalPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showPhotoToast, setShowPhotoToast] = useState(false)

  // Button interaction states
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Reset function
  const handleCancel = () => {
    setFirstName("Davis")
    setLastName("Levin")
    setDob("1988-06-15")
    setGender("male")
    setEmailAddress("davis.levin@teamhub.com")
    setPhoneNumber("+1 (555) 0123-4567")
    setAlternatePhone("")
    setResidentialAddress("1284 Corporate Way, Suite 500, San Francisco, CA 94105")
  }

  // Handle save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2500);
    }, 1200);
  }

  return (
    <AppLayout 
      title="Personal Information" 
      breadcrumbs={[
        { label: "Settings", href: "/settings/personal-info" }, 
        { label: "Personal Information" }
      ]}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Profile Card + Edit form */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            
            {/* Profile Header Card */}
            <section className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="relative group shrink-0">
                <img 
                  src={profileImage} 
                  alt="Davis Levin Avatar" 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-slate-50 shadow-md transition-all duration-300 group-hover:scale-[1.02]"
                />
                <button 
                  type="button"
                  onClick={() => { setShowPhotoModal(true); setUploadedFile(null); setModalPreviewUrl(null); }}
                  className="absolute -bottom-2 -right-2 bg-brand-dark hover:bg-brand text-white p-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="h-4.5 w-4.5" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2 text-center sm:text-left grow">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950">Davis Levin</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">HR Manager — Employee ID: TH-4829</p>
                <div className="flex flex-wrap gap-2 mt-1 justify-center sm:justify-start">
                  <span className="bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Full-time
                  </span>
                  <span className="bg-slate-50 text-slate-500 px-3.5 py-1 rounded-full text-xs font-bold border border-slate-100/80">
                    Joined Oct 2021
                  </span>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => { setShowPhotoModal(true); setUploadedFile(null); setModalPreviewUrl(null); }}
                className="shrink-0 border border-slate-200 hover:border-brand-dark text-slate-700 hover:text-brand-dark hover:bg-brand/5 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors active:scale-95 cursor-pointer"
              >
                Change Photo
              </button>
            </section>

            {/* Form Section */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-8 shadow-sm">
              
              {/* General Information sub-form */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-dark flex items-center justify-center">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800">General Information</h4>
                  <div className="h-px grow bg-slate-100"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Date of Birth</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10 select-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10 cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details sub-form */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-dark flex items-center justify-center">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800">Contact Details</h4>
                  <div className="h-px grow bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="pl-11 w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-11 w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Alternate Phone (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="N/A"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500">Residential Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 font-bold" />
                      <input 
                        type="text" 
                        value={residentialAddress}
                        onChange={(e) => setResidentialAddress(e.target.value)}
                        className="pl-11 w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action row buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 active:scale-95 transition-all text-center leading-none"
                >
                  Cancel
                </button>

                <button 
                  type="submit"
                  disabled={isSaving || isSaved}
                  className={`relative flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-brand/10 transition-all active:scale-95 disabled:pointer-events-none min-w-[150px]`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Information panel & metrics */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            
            {/* Privacy & Security banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-emerald-100 opacity-20 pointer-events-none">
                <Shield className="h-40 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                  <Shield className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Privacy & Security</h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed opacity-90">
                Your personal information is encrypted and only visible to HR administrators and yourself. We never share your data with 3rd parties.
              </p>
              <a 
                href="#privacy"
                onClick={(e) => e.preventDefault()}
                className="text-emerald-700 hover:text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Review Privacy Policy</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Account Status card */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-800">Account Status</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-50 text-slate-600 text-xs sm:text-sm">
                  <span>Two-Factor Auth</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" /> Active
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-50 text-slate-600 text-xs sm:text-sm">
                  <span>Password Strength</span>
                  <span className="text-slate-800 font-bold">Strong</span>
                </div>

                <div className="flex items-center justify-between py-2 text-slate-600 text-xs sm:text-sm">
                  <span>Last Login</span>
                  <span className="text-slate-800 font-bold">2 hours ago</span>
                </div>
              </div>

              <button 
                type="button"
                className="mt-2 w-full border border-slate-200 hover:border-brand-dark text-slate-700 hover:text-brand-dark hover:bg-brand/5 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors active:scale-[0.98]"
              >
                Security Settings
              </button>
            </section>

          </div>

        </div>
      </div>

      {/* Floating Success Toast notification */}
      {showPhotoToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white rounded-full px-6 py-3.5 flex items-center gap-3 shadow-2xl z-50 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-bold tracking-wide">Profile picture successfully updated!</p>
        </div>
      )}

      {/* Change Photo Modal Overlay */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => { if (!isUploading) setShowPhotoModal(false); }}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200 z-10">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Change Photo</h3>
              <button 
                type="button"
                disabled={isUploading}
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Preview Section */}
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-450 text-slate-400 uppercase tracking-widest mb-3 self-start">
                  Current Photo
                </p>
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4e7d8] shadow-md mb-2">
                  <img 
                    src={modalPreviewUrl || profileImage} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium">JPG, PNG or GIF. Max size 2MB.</p>
              </div>

              {/* Drag & Drop Area */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    setUploadedFile(file);
                    setModalPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                onClick={() => {
                  document.getElementById("photo-upload-input")?.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group text-center ${
                  dragActive 
                    ? "border-[#006b5f] bg-[#d4e7d8]/30" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-[#d4e7d8]/20 hover:border-[#006b5f]/50"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#d4e7d8]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-[#006b5f]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-800">
                    {uploadedFile ? uploadedFile.name : "Drag and drop your photo here"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : <>or <span className="text-[#006b5f] font-bold">browse files</span> from your computer</>}
                  </p>
                </div>
                <input 
                  type="file" 
                  id="photo-upload-input" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setUploadedFile(file);
                      setModalPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden" 
                />
              </div>

              {/* Guidance Note */}
              <div className="bg-[#e8e2d4]/50 border border-[#cbc6b9]/40 p-3.5 rounded-xl flex gap-3 text-[#1d1c13]">
                <Info className="h-5 w-5 text-[#49473d] shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                  Photos help your teammates recognize you. Please upload a clear headshot where your face is clearly visible.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button"
                disabled={isUploading}
                onClick={() => setShowPhotoModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={isUploading}
                onClick={() => {
                  setIsUploading(true);
                  setTimeout(() => {
                    setIsUploading(false);
                    if (modalPreviewUrl) {
                      setProfileImage(modalPreviewUrl);
                    } else {
                      // fallback dummy headshot if they just clicked upload blank
                      setProfileImage("https://lh3.googleusercontent.com/aida-public/AB6AXuBd6mO6HYVYkN4FJIvgDMqwDGEdHz5PYen7CzPyrG5AL5B9WhE8tTPHhMx1PnzuGuIlcHOqJ6KYHsmv6Zz3dk84CPYkHNWOqMHcetrQBjV0cj30fXzZy8Kh5-CaY2gC3To5KbUWLZxCVTTUDoQGHP3cVQzgr2XfrFGzQjeqtHTUozqororLmzDNAgiu534h5dbiX1MUqH6F3T0MtsttjfotirNnOcBAE-0mzFMzO37JbiEMnHjKlyIOyCfO870gaDaOGZASXfWaFcI");
                    }
                    setShowPhotoModal(false);
                    setShowPhotoToast(true);
                    setTimeout(() => setShowPhotoToast(false), 3000);
                  }, 1100);
                }}
                className="px-6 py-2.5 bg-[#006b5f] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#005047] shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {isUploading ? (
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
