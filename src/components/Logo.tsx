import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function IssueLensLogo({ className = "w-8 h-8", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
    >
      <defs>
        {/* Sleek titanium to electric indigo linear gradient */}
        <linearGradient id="lensRingGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="lensReticleGrad" x1="10" y1="10" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Dark Titanium Frame Badge */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        fill="#0a0e17"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.2"
      />

      {/* Precision Scope Reticle Brackets (Code Scope + Viewfinder) */}
      {/* Top-Left */}
      <path
        d="M8.5 12V9C8.5 8.72 8.72 8.5 9 8.5H12"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Top-Right */}
      <path
        d="M20 8.5H23C23.28 8.5 23.5 8.72 23.5 9V12"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Bottom-Left */}
      <path
        d="M8.5 20V23C8.5 23.28 8.72 23.5 9 23.5H12"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Bottom-Right */}
      <path
        d="M20 23.5H23C23.28 23.5 23.5 23.28 23.5 23V20"
        stroke="#94a3b8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Optical Lens Core Ring */}
      <circle
        cx="16"
        cy="16"
        r="5.5"
        stroke="url(#lensRingGrad)"
        strokeWidth="1.8"
      />

      {/* Optical Center Crosshair / Focal Point */}
      <circle
        cx="16"
        cy="16"
        r="1.8"
        fill="url(#lensReticleGrad)"
      />

      {/* Axis Micro-Ticks */}
      <line x1="16" y1="6.5" x2="16" y2="8" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="24" x2="16" y2="25.5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6.5" y1="16" x2="8" y2="16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="16" x2="25.5" y2="16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
