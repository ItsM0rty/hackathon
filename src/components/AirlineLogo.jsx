import React from 'react';

// Map airline codes/names to actual filenames in assets/airlines
const airlineLogoMap = {
  'QR': 'qatar-airways-1.svg', // Qatar Airways
  'Qatar Airways': 'qatar-airways-1.svg',
  'TK': 'turkish-airlines-logo.svg', // Turkish Airlines
  'Turkish Airlines': 'turkish-airlines-logo.svg',
  'EK': 'emirates-1.svg', // Emirates
  'Emirates': 'emirates-1.svg',
  'AI': 'air-india-2.svg', // Air India
  'Air India': 'air-india-2.svg',
  'SQ': 'singapore-airlines.svg', // Singapore Airlines
  'Singapore Airlines': 'singapore-airlines.svg',
  'RA': 'nepal airlines.svg', // Nepal Airlines
  'Nepal Airlines': 'nepal airlines.svg',
  '6E': 'indigo-airlines-logo.svg', // IndiGo
  'IndiGo': 'indigo-airlines-logo.svg',
  'FZ': 'fly-dubai-1.svg', // FlyDubai
  'FlyDubai': 'fly-dubai-1.svg',
  'MH': 'malaysia-airlines-1.svg', // Malaysia Airlines
  'Malaysia Airlines': 'malaysia-airlines-1.svg',
  'TG': 'thai-airways-3.svg', // Thai Airways
  'Thai Airways': 'thai-airways-3.svg',
  'CZ': 'china-southern-1.svg', // China Southern
  'China Southern': 'china-southern-1.svg',
  'G9': 'air-arabia-logo.svg', // Air Arabia
  'Air Arabia': 'air-arabia-logo.svg',
  'BG': 'biman-bangladesh-airlines.svg', // Biman Bangladesh
  'Biman Bangladesh': 'biman-bangladesh-airlines.svg',
  'KB': 'Drukair-royal-bhutan-airlines-logo.svg', // Druk Air
  'Druk Air': 'Drukair-royal-bhutan-airlines-logo.svg',
  'H9': 'himalaya airlines.svg', // Himalaya Airlines
  'Himalaya Airlines': 'himalaya airlines.svg',
};

// Vite import all SVGs in airlines folder
const logoSvgs = import.meta.glob('/src/assets/airlines/*.svg', { eager: true, as: 'url' });

const AirlineLogo = ({ airlineCode, airlineName, className = "w-28 h-12 object-contain rounded-lg" }) => {
  const logoFile = airlineLogoMap[airlineCode] || airlineLogoMap[airlineName];
  const logoUrl = logoFile ? logoSvgs[`/src/assets/airlines/${logoFile}`] : null;
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${airlineName || airlineCode} logo`}
        className={className}
        onError={e => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          const parent = e.target.parentNode;
          if (parent) parent.innerHTML += `<span style='color:#888;font-size:0.9em;'>${airlineName || airlineCode}</span>`;
        }}
      />
    );
  }
  return <span className="text-gray-400 text-sm">{airlineName || airlineCode}</span>;
};

export default AirlineLogo; 