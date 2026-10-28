export default function PortraitPlaceholder() {
  return (
    <svg
      viewBox="0 0 260 230"
      role="img"
      aria-label="Profile photo placeholder"
    >
      <defs>
        <lineargradient id="portrait-bg" x2="1" y2="1">
          <stop stopColor="#e7ecf2" />
          <stop offset="1" stopColor="#dce5ed" />
        </lineargradient>
        <lineargradient id="portrait-shape" x2="0" y2="1">
          <stop stopColor="#b7c5d3" />
          <stop offset="1" stopColor="#a4b5c7" />
        </lineargradient>
        <pattern
          id="portrait-grid"
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M26 0H0V26"
            fill="none"
            stroke="#c5d0dc"
            strokeOpacity=".45"
            strokeWidth=".6"
          />
        </pattern>
      </defs>
      <path fill="url(#portrait-bg)" d="M0 0H260V230H0z" />
      <path fill="url(#portrait-grid)" d="M0 0H260V230H0z" />
      <circle
        cx="130"
        cy="99"
        r="72"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="1"
      />
      <circle cx="130" cy="93" r="34" fill="url(#portrait-shape)" />
      <path
        d="M57 230V213C57 163 84 143 130 143S203 163 203 213V230"
        fill="url(#portrait-shape)"
      />
      <path
        d="M15 31V15H31M229 15H245V31M245 199V215H229M31 215H15V199"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <path d="M126 24H134M130 20V28" stroke="#94a3b8" strokeWidth="1" />
    </svg>
  );
}
