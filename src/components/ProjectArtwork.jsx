const artwork = {
  whil: (
    <svg viewBox="0 0 360 150" fill="none" aria-hidden="true">
      <g stroke="#6e66c4" strokeWidth="1.1">
        <rect x="38" y="49" width="76" height="53" rx="8" fill="white" />
        <circle cx="64" cy="68" r="6" />
        <path d="M54 88C54 78 74 78 74 88M83 65H103M83 73H99M83 81H94M114 75H152M208 75H246" />
        <circle cx="180" cy="75" r="28" fill="white" />
        <circle cx="180" cy="67" r="10" />
        <circle cx="173" cy="80" r="10" />
        <circle cx="187" cy="80" r="10" />
        <rect x="246" y="49" width="76" height="53" rx="8" fill="white" />
        <path d="M260 66H308M260 75H295M260 84H303" />
        <path
          d="M180 104V120H76V103M180 104V120H284V103"
          strokeDasharray="3 4"
        />
      </g>
    </svg>
  ),
  las: (
    <svg viewBox="0 0 360 150" fill="none" aria-hidden="true">
      <g stroke="#328d83" strokeWidth="1.1">
        <path d="M45 112V34M45 112H318" strokeOpacity=".45" />
        <rect x="65" y="75" width="22" height="36" rx="3" fill="#328d8322" />
        <rect x="102" y="60" width="22" height="51" rx="3" fill="#328d8333" />
        <rect x="139" y="42" width="22" height="69" rx="3" fill="#328d8344" />
        <rect x="176" y="67" width="22" height="44" rx="3" fill="#328d8322" />
        <path d="M212 88L242 60L273 74L310 38" strokeWidth="2" />
        <circle cx="242" cy="60" r="4" fill="white" />
        <circle cx="273" cy="74" r="4" fill="white" />
        <circle cx="310" cy="38" r="4" fill="white" />
      </g>
    </svg>
  ),
  wtw: (
    <svg viewBox="0 0 360 150" fill="none" aria-hidden="true">
      <g stroke="#ba8b3f" strokeWidth="1.1">
        <rect x="47" y="35" width="113" height="82" rx="8" fill="white" />
        <rect x="200" y="35" width="113" height="82" rx="8" fill="white" />
        <path
          d="M47 54H160M200 54H313M62 68H143M62 77H115M62 98H104M215 68H295M215 77H264M215 98H257"
          strokeOpacity=".6"
        />
        <circle cx="59" cy="44" r="2" fill="#ba8b3f" />
        <circle cx="212" cy="44" r="2" fill="#ba8b3f" />
        <path d="M160 75H200M183 71L187 75L183 79" />
        <rect x="113" y="90" width="32" height="15" rx="3" fill="#ba8b3f22" />
        <rect x="266" y="90" width="32" height="15" rx="3" fill="#ba8b3f66" />
      </g>
    </svg>
  ),
  cie: (
    <svg viewBox="0 0 360 150" fill="none" aria-hidden="true">
      <g stroke="#7286a0" strokeWidth="1.1">
        <path
          d="M180 24L238 57V121L180 148L122 115V57Z"
          transform="translate(0 -10)"
          fill="white"
        />
        <path d="M122 47L180 80L238 47M180 80V138M180 14V80" />
        <path d="M72 85L101 68L130 85V117L101 134L72 117Z" fill="#7286a013" />
        <path d="M72 85L101 102L130 85M101 102V134" />
        <path d="M230 68L259 51L288 68V100L259 117L230 100Z" fill="#7286a013" />
        <path d="M230 68L259 85L288 68M259 85V117" />
      </g>
    </svg>
  ),
};
export default function ProjectArtwork({ id }) {
  return artwork[id] || null;
}
