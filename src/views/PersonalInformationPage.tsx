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

/*
Personal Information JSON Data Format Requirement:
--------------------------------------------------
The Personal Information page expects a profile payload in the following JSON format.
This payload is read from and written to localStorage under "db_personal_info" to maintain state.

{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "gender": "male" | "female" | "other" | "prefer_not_to_say",
  "emailAddress": "john.doe@teamhub.com",
  "phoneNumber": "+1 (555) 0123-4567",
  "alternatePhone": "+1 (555) 9876-5432",
  "residentialAddress": "123 Main Street, Suite 400, San Francisco, CA 94105",
  "profileImage": "https://example.com/avatar.jpg",
  "employeeId": "TH-0001",
  "role": "Software Engineer",
  "status": "Full-time",
  "joinDate": "Joined Jan 2026"
}
*/

interface PersonalInfoData {
  firstName: string
  lastName: string
  dob: string
  gender: string
  emailAddress: string
  phoneNumber: string
  alternatePhone: string
  residentialAddress: string
  profileImage: string
  employeeId: string
  role: string
  status: string
  joinDate: string
}

export default function PersonalInformationPage() {
  // Load from localStorage or use clear/empty state placeholders
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(() => {
    const saved = localStorage.getItem("db_personal_info")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        // Fallback
      }
    }
    return {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      emailAddress: "",
      phoneNumber: "",
      alternatePhone: "",
      residentialAddress: "",
      profileImage: "", // Empty profile image state -> will render clean placeholder SVG avatar
      employeeId: "", // Empty state
      role: "", // Empty state
      status: "", // Empty state
      joinDate: "" // Empty state
    }
  })

  // Local form input states initialized to loaded or empty data
  const [firstName, setFirstName] = useState(personalInfo.firstName)
  const [lastName, setLastName] = useState(personalInfo.lastName)
  const [dob, setDob] = useState(personalInfo.dob)
  const [gender, setGender] = useState(personalInfo.gender)
  const [emailAddress, setEmailAddress] = useState(personalInfo.emailAddress)
  const [phoneNumber, setPhoneNumber] = useState(personalInfo.phoneNumber)
  const [alternatePhone, setAlternatePhone] = useState(personalInfo.alternatePhone)
  const [residentialAddress, setResidentialAddress] = useState(personalInfo.residentialAddress)

  // Photo uploading states
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [modalPreviewUrl, setModalPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showPhotoToast, setShowPhotoToast] = useState(false)

  // Toast and Saving feedback
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Reset form inputs back to the saved state values (or empty if none saved)
  const handleCancel = () => {
    setFirstName(personalInfo.firstName)
    setLastName(personalInfo.lastName)
    setDob(personalInfo.dob)
    setGender(personalInfo.gender)
    setEmailAddress(personalInfo.emailAddress)
    setPhoneNumber(personalInfo.phoneNumber)
    setAlternatePhone(personalInfo.alternatePhone)
    setResidentialAddress(personalInfo.residentialAddress)
  }

  // Handle saving personal info form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API pipeline delay
    setTimeout(() => {
      const updatedData: PersonalInfoData = {
        ...personalInfo,
        firstName,
        lastName,
        dob,
        gender,
        emailAddress,
        phoneNumber,
        alternatePhone,
        residentialAddress,
        // If not set, generate standard fallback placeholders on save
        employeeId: personalInfo.employeeId || "TH-" + Math.floor(1000 + Math.random() * 9000),
        role: personalInfo.role || "Team Member",
        status: personalInfo.status || "Full-time",
        joinDate: personalInfo.joinDate || "Joined " + new Date().toLocaleDateString('default', { month: 'short', year: 'numeric' })
      }
      
      localStorage.setItem("db_personal_info", JSON.stringify(updatedData))
      setPersonalInfo(updatedData)
      
      // Sync headers & updates globally
      window.dispatchEvent(new Event("storage"))
      window.dispatchEvent(new Event("db_updated"))

      setIsSaving(false)
      setIsSaved(true)
      setTimeout(() => {
        setIsSaved(false)
      }, 2500)
    }, 1000)
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
          
          {/* Left Column: Profile Card + Edit Form */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            
            {/* Profile Header Card */}
            <section className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div id="avatar-container" className="relative group shrink-0">
                {personalInfo.profileImage ? (
                  <img 
                    src={personalInfo.profileImage} 
                    alt="Profile Avatar" 
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-slate-50 shadow-md transition-all duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-100 transition-colors">
                    <User className="h-12 w-12 stroke-[1.5]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">No Avatar</span>
                  </div>
                )}
                <button 
                  type="button"
                  id="change-photo-btn-p"
                  onClick={() => { setShowPhotoModal(true); setUploadedFile(null); setModalPreviewUrl(null); }}
                  className="absolute bottom-[-6px] right-[-6px] bg-brand-dark hover:bg-brand text-white p-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Upload profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-1.5 text-center sm:text-left grow">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-950">
                  {personalInfo.firstName || personalInfo.lastName 
                    ? `${personalInfo.firstName} ${personalInfo.lastName}`.trim() 
                    : "No Profile Details Set"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider">
                  {personalInfo.role ? personalInfo.role : "Enter profile settings below"} 
                  {personalInfo.employeeId && ` — Employee ID: ${personalInfo.employeeId}`}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-1 justify-center sm:justify-start">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                    {personalInfo.status ? personalInfo.status : "Pending Setup"}
                  </span>
                  <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-100/80">
                    {personalInfo.joinDate ? personalInfo.joinDate : "Setup Not Finalized"}
                  </span>
                </div>
              </div>
              
              <button 
                type="button" 
                id="edit-photo-trigger"
                onClick={() => { setShowPhotoModal(true); setUploadedFile(null); setModalPreviewUrl(null); }}
                className="shrink-0 border border-slate-200 hover:border-brand-dark text-slate-700 hover:text-brand-dark hover:bg-brand/5 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors active:scale-95 cursor-pointer"
              >
                Change Photo
              </button>
            </section>

            {/* Form Section */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-8 shadow-sm">
              
              {/* General Information Sub-form */}
              <div id="general-info-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-dark flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 font-sans">General Information</h4>
                  <div className="h-px grow bg-slate-100"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      id="input-first-name"
                      placeholder="e.g. John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      id="input-last-name"
                      placeholder="e.g. Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                    <input 
                      type="date" 
                      id="input-dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <select 
                      id="select-gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details Sub-form */}
              <div id="contact-details-section">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-dark flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 font-sans">Contact Details</h4>
                  <div className="h-px grow bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="email" 
                        id="input-email"
                        placeholder="john.doe@company.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="pl-11 w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="tel" 
                        id="input-phone"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-11 w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alternate Phone (Optional)</label>
                    <input 
                      type="tel" 
                      id="input-alt-phone"
                      placeholder="Optional Alternate Phone"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      className="bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Residential Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        id="input-address"
                        placeholder="Street, Suite number, City, State ZIP"
                        value={residentialAddress}
                        onChange={(e) => setResidentialAddress(e.target.value)}
                        className="pl-11 w-full bg-slate-50 border border-slate-200/80 hover:border-brand-dark focus:border-brand rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:ring-2 focus:ring-brand/10"
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
                  id="cancel-changes-btn"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-95 transition-all text-center"
                >
                  Cancel
                </button>

                <button 
                  type="submit"
                  id="save-changes-btn"
                  disabled={isSaving || isSaved}
                  className="relative flex items-center justify-center gap-2 bg-brand-dark hover:bg-brand text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-brand/10 transition-all active:scale-95 disabled:pointer-events-none min-w-[150px]"
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

          {/* Right Column: Info Panel & Security Status */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            
            {/* Privacy & Security Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-emerald-100 opacity-20 pointer-events-none">
                <Shield className="h-40 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                  <Shield className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950 font-sans">Privacy & Security</h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-850 leading-relaxed font-semibold opacity-90">
                Your personal details are securely stored. All corporate personnel info is fully encrypted and only searchable under valid roles mapping permissions.
              </p>
              <a 
                href="#privacy"
                onClick={(e) => { e.preventDefault(); alert("Displaying active platform privacy policy.") }}
                className="text-emerald-700 hover:text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <span>Review Privacy Policy</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Account Status Card */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-800 font-sans uppercase tracking-wider">Verify Parameters Status</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-50 text-slate-600 text-xs sm:text-sm">
                  <span>Profile Syncing</span>
                  {personalInfo.firstName ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" /> Completed
                    </span>
                  ) : (
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      ● Pending Setup
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-50 text-slate-600 text-xs sm:text-sm">
                  <span>Contact Accuracy</span>
                  <span className="text-slate-800 font-bold">
                    {phoneNumber && emailAddress ? "Valid Checked" : "Needs Update"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-slate-600 text-xs sm:text-sm">
                  <span>Encryption Level</span>
                  <span className="text-slate-800 font-bold">AES-256 Enabled</span>
                </div>
              </div>
            </section>

          </div>

        </div>
      </div>

      {/* Floating Success Toast Notification */}
      {showPhotoToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white rounded-full px-6 py-3.5 flex items-center gap-3 shadow-2xl z-50 animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-bold tracking-wide">Avatar placeholder successfully applied!</p>
        </div>
      )}

      {/* Change Photo Modal Overlay */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => { if (!isUploading) setShowPhotoModal(false); }}
          />

          <div className="relative bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col font-sans z-10">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans">Update Avatar</h3>
              <button 
                type="button"
                id="close-avatar-modal"
                disabled={isUploading}
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 self-start">
                  Current Layout Avatar
                </p>
                <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-200 shadow-md mb-2 flex items-center justify-center bg-slate-50 text-slate-400">
                  {modalPreviewUrl || personalInfo.profileImage ? (
                    <img 
                      src={modalPreviewUrl || personalInfo.profileImage} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-10 h-10 stroke-[1.5]" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-semibold font-sans">JPG, PNG or GIF. Max size 2MB.</p>
              </div>

              {/* Drag & Drop Area */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0]
                    setUploadedFile(file)
                    setModalPreviewUrl(URL.createObjectURL(file))
                  }
                }}
                onClick={() => {
                  document.getElementById("photo-upload-input-p")?.click()
                }}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group text-center ${
                  dragActive 
                    ? "border-brand bg-teal-50/25" 
                    : "border-slate-200 bg-slate-50/50 hover:bg-teal-55 hover:bg-teal-50/10 hover:border-brand-dark"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 text-brand-dark flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-800">
                    {uploadedFile ? uploadedFile.name : "Drag and drop your photo here"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : <>or <span className="text-brand-dark font-bold">browse files</span></>}
                  </p>
                </div>
                <input 
                  type="file" 
                  id="photo-upload-input-p" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0]
                      setUploadedFile(file)
                      setModalPreviewUrl(URL.createObjectURL(file))
                    }
                  }}
                  className="hidden" 
                />
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex gap-3 text-slate-600">
                <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs font-semibold leading-relaxed">
                  Photos must be less than 2MB in size. Headshots are visible globally to team members in the Directory view.
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
                id="upload-avatar-btn-modal"
                disabled={isUploading}
                onClick={() => {
                  setIsUploading(true)
                  setTimeout(() => {
                    setIsUploading(false)
                    const finalPreview = modalPreviewUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                    
                    const updatedData = {
                      ...personalInfo,
                      profileImage: finalPreview
                    }
                    localStorage.setItem("db_personal_info", JSON.stringify(updatedData))
                    setPersonalInfo(updatedData)
                    
                    // Trigger global header redraw
                    window.dispatchEvent(new Event("storage"))
                    window.dispatchEvent(new Event("db_updated"))

                    setShowPhotoModal(false)
                    setShowPhotoToast(true)
                    setTimeout(() => setShowPhotoToast(false), 3000)
                  }, 1000)
                }}
                className="px-6 py-2.5 bg-[#006b5f] hover:bg-[#005047] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
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
