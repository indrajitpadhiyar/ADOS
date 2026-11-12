import React from 'react';

/**
 * AdosLogo Component
 * Official brand mark for ADOS (Adaptive Digital Operating System)
 * Features the signature 6 rounded blocks arranged in an arch with the amber top block.
 */
export default function AdosLogo({ className = "w-10 h-10" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Center Block (Amber Yellow) */}
      <rect x="186" y="24" width="140" height="136" rx="38" fill="#FFCC04" stroke="#0F1115" strokeWidth="14" strokeLinejoin="round" />
      
      {/* Middle Row Blocks (White) */}
      <rect x="22" y="188" width="140" height="136" rx="38" fill="#FFFFFF" stroke="#0F1115" strokeWidth="14" strokeLinejoin="round" />
      <rect x="186" y="188" width="140" height="136" rx="38" fill="#FFFFFF" stroke="#0F1115" strokeWidth="14" strokeLinejoin="round" />
      <rect x="350" y="188" width="140" height="136" rx="38" fill="#FFFFFF" stroke="#0F1115" strokeWidth="14" strokeLinejoin="round" />
      
      {/* Bottom Row Blocks (White) */}
      <rect x="22" y="352" width="140" height="136" rx="38" fill="#FFFFFF" stroke="#0F1115" strokeWidth="14" strokeLinejoin="round" />
      <rect x="350" y="352" width="140" height="136" rx="38" fill="#FFFFFF" stroke="#0F1115" strokeWidth="14" strokeLinejoin="round" />
    </svg>
  );
}
