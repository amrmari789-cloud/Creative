export function CreativeAssociateLogo({ className = "h-10 w-10" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="120"
        height="120"
        rx="26"
        fill="url(#creative-associate-gradient)"
      />
      <path
        d="M34 82c6.5 7.5 15.8 12 26 12 19.3 0 35-15.7 35-35S79.3 24 60 24c-10.2 0-19.5 4.5-26 12"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 60c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14-14-6.3-14-14Z"
        fill="white"
      />
      <path
        d="M54.5 60a5.5 5.5 0 0 1 11 0 5.5 5.5 0 0 1-11 0Z"
        fill="#0F172A"
      />
      <defs>
        <linearGradient
          id="creative-associate-gradient"
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#111827" />
          <stop offset="0.5" stopColor="#1E3A8A" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
    </svg>
  )
}

