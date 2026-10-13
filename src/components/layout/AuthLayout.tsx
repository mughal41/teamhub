import * as React from "react";
import { Link } from "react-router-dom";

import loginHeroBg from "../../assets/login-bg.webp";
import { TeamHubIcon } from "../ui/TeamHubLogo";

export interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroSubtitle?: string;
  formTitle?: string;
  formSubtitle?: string;
  title?: string;
  subtitle?: string;
  showLogoInForm?: boolean;
}

export function AuthLayout({
  children,
  heroTitle = "Welcome to TeamHub",
  heroSubtitle = "Manage your HR tasks smarter, faster, and easier — all in one place",
  formTitle,
  formSubtitle,
  title,
  subtitle,
  showLogoInForm = true,
}: AuthLayoutProps) {
  const displayFormTitle = formTitle || title || "Welcome Back";
  const displayFormSubtitle =
    formSubtitle ||
    subtitle ||
    "Enter your email and password to access your account";

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-['DM_Sans',sans-serif] text-[#203430] overflow-x-hidden selection:bg-[#35BFA3]/20 selection:text-[#203430]">
      {/* =========================================================================
          LEFT PANEL — EXACT FIGMA DIMENSIONS & STRUCTURE
          Desktop: 720px wide (50% of 1440px), 1024px height / full screen
          Padding: 80px 64px, gap: 64px
          Background: linear-gradient(360deg, rgba(32, 52, 48, 0) 0%, rgba(32, 52, 48, 0.24) 81.49%, rgba(32, 52, 48, 0.6) 100%), url(3e957e8b4d8a70a13e6ccfa1cf07c91b09675d3b-1-1.webp);
          Clean photographic texture from user Figma reference — strictly zero synthetic SVGs, zero dots, zero connecting lines
          ========================================================================= */}
      <section
        aria-label="Brand Overview"
        className="relative w-full lg:w-1/2 min-h-[560px] lg:min-h-screen flex flex-col items-center justify-start p-8 sm:p-12 lg:p-[80px_64px] gap-8 lg:gap-[64px] overflow-hidden select-none"
        style={{
          backgroundColor: "#198765",
          backgroundImage: `linear-gradient(360deg, rgba(32, 52, 48, 0) 0%, rgba(32, 52, 48, 0.24) 81.49%, rgba(32, 52, 48, 0.6) 100%), url(${loginHeroBg}), url('/3e957e8b4d8a70a13e6ccfa1cf07c91b09675d3b-1-1.webp'), url('/login-bg.webp'), url('/mans-hand-is-pointing-small-figure-green-background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Subtle organic wall texture layer when photographic asset is loading or falling back */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* =====================================================================
            TOP LOGO SECTION (Exact Figma CSS)
            Width: 135px, Height: 36px
            Centered horizontally in the panel
            Official TeamHub Icon: 28px, #35BFA3
            TeamHub: 'DM Sans', 600, 22px, line-height 120%, letter-spacing -0.08em, #FFFFFF
            ===================================================================== */}
        <header className="relative z-10 flex items-center justify-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-[12px] h-[36px] transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
            style={{ width: "135px" }}
            aria-label="TeamHub Home"
          >
            {/* Official TeamHub Icon */}
            <TeamHubIcon size={28} color="#35BFA3" className="shrink-0 transition-transform group-hover:scale-105" />

            {/* TeamHub Wordmark */}
            <span
              className="text-white font-semibold text-[22px] leading-[120%] tracking-[-0.08em]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              TeamHub
            </span>
          </Link>
        </header>

        {/* =====================================================================
            HEADER-SECTION (Exact Figma Auto-Layout CSS)
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            width: 592px; height: 74px;
            Title: Heading/40-Bold, 40px, 700, line-height: 120% (48px), letter-spacing: -0.04em, text-align: center, #FFFFFF
            Subtitle: Body/16-Regular, 16px, 400, line-height: 140% (22px), text-align: center, #FFFFFF
            ===================================================================== */}
        <div className="relative z-10 w-full max-w-[592px] flex flex-col items-center text-center gap-[4px]">
          <h1
            className="w-full text-white font-bold text-[32px] sm:text-[40px] leading-[120%] tracking-[-0.04em]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {heroTitle}
          </h1>
          <p
            className="w-full text-white/95 font-normal text-[15px] sm:text-[16px] leading-[140%] max-w-[540px]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {heroSubtitle}
          </p>
        </div>

        {/* The rest of the container remains transparent to display the photographic wallpaper asset directly below */}
        <div className="flex-1 w-full" />
      </section>

      {/* =========================================================================
          RIGHT PANEL — EXACT FIGMA DIMENSIONS & STRUCTURE
          Desktop: 720px wide (50% of 1440px), 1024px height / full screen
          Background: #FFFFFF (Pure White)
          Centered Form Container with exact typography & spacing
          ========================================================================= */}
      <main
        aria-label="Authentication Form"
        className="w-full lg:w-1/2 min-h-[560px] lg:min-h-screen flex items-center justify-center p-6 sm:p-12 lg:p-[64px_80px] bg-white"
      >
        <div className="w-full max-w-[440px] flex flex-col items-center">
          {/* Centered Brand Symbol on Right Panel (Official TeamHub Icon) */}
          {showLogoInForm && (
            <div className="mb-6 flex items-center justify-center">
              <TeamHubIcon size={44} color="#35BFA3" className="transition-transform hover:scale-105" />
            </div>
          )}

          {/* Form Header Section */}
          <div className="w-full text-center mb-8">
            <h2
              className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-[-0.03em] leading-[120%]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {displayFormTitle}
            </h2>
            <p className="mt-2 text-sm text-[#64748B] font-normal leading-[140%]">
              {displayFormSubtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
