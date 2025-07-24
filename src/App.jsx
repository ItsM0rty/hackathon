import { useState, useEffect, useRef } from 'react';
import SecondPage from './SecondPage';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import countryCityData from './data/countries-cities.json';
import Select from 'react-select';
import syambhu0 from './assets/landing page/syambhu.jpg';
import syambhu1 from './assets/landing page/syambhu1.jpg';
import syambhu2 from './assets/landing page/syambhu2.jpg';
import syambhu3 from './assets/landing page/syambhu3.jpg';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import headerImage from './assets/landing page/Header image.jpg';

// Hide scrollbars globally
const globalStyle = `
  html, body, * {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar {
    display: none !important;
  }
`;

const LOCATIONS = [
  { label: 'Kathmandu', value: 'kathmandu' },
  { label: 'Pokhara', value: 'pokhara' },
];

const RECOMMENDATIONS = {
  kathmandu: [
    { name: 'Swayambhunath Stupa', desc: 'Visit the iconic Monkey Temple', price: '$10', rating: 4.8 },
    { name: 'Pashupatinath Temple', desc: 'Explore the sacred Hindu temple', price: '$5', rating: 4.7 },
    { name: 'Thamel', desc: 'Experience the vibrant nightlife', price: 'Free', rating: 4.5 },
  ],
  pokhara: [
    { name: 'Phewa Lake', desc: 'Boating and lakeside relaxation', price: '$15', rating: 4.9 },
    { name: 'Sarangkot', desc: 'Sunrise and paragliding spot', price: '$20', rating: 4.8 },
    { name: 'Davis Falls', desc: 'Scenic waterfall visit', price: '$3', rating: 4.6 },
  ],
};

// Add image imports for Swayambhunath slideshow
const swayambhuImages = [
  syambhu0,
  syambhu1,
  syambhu2,
  syambhu3,
];

// Add custom theme colors
const PRIMARY_COLOR = '#144D4A';
const SECONDARY_COLOR = '#F26B3A';
const PEACH_CORAL = '#FFBFAE';

// Custom CSS for hover/focus border color
const themeStyle = `
  .themed-taskbar {
    background: #144D4A;
    color: #fff;
    border: 2px solid #144D4A;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    box-shadow: 0 2px 16px 0 rgba(20,77,74,0.10);
  }
  .themed-taskbar:focus-within, .themed-taskbar:hover {
    border-color: #F26B3A;
    box-shadow: 0 4px 24px 0 rgba(242,107,58,0.18);
    transform: scale(1.02);
  }
  .themed-card {
    background: #144D4A;
    color: #fff;
    border: 2px solid #144D4A;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    box-shadow: 0 2px 16px 0 rgba(20,77,74,0.10);
  }
  .themed-card:hover {
    border-color: #F26B3A;
    box-shadow: 0 4px 24px 0 rgba(242,107,58,0.18);
    transform: scale(1.02);
  }
`;

// Add custom CSS for react-select input text color
const selectInputStyle = `
  .custom-select__input input {
    color: #FFBFAE !important;
    background: #144D4A !important;
  }
`;

function MainPage() {
  const [selectedLocation, setSelectedLocation] = useState('kathmandu');
  const [arriving, setArriving] = useState('kathmandu');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  // Slideshow state for Swayambhunath
  const [swayambhuSlide, setSwayambhuSlide] = useState(0);
  const [isSwayambhuHovered, setIsSwayambhuHovered] = useState(false);
  const swayambhuTimeout = useRef();
  const [swayambhuHoverSide, setSwayambhuHoverSide] = useState(null); // 'left', 'right', or null

  // Auto-rotate Swayambhu images
  useEffect(() => {
    if (isSwayambhuHovered) return;
    swayambhuTimeout.current = setTimeout(() => {
      setSwayambhuSlide((swayambhuSlide + 1) % swayambhuImages.length);
    }, 3000);
    return () => clearTimeout(swayambhuTimeout.current);
  }, [swayambhuSlide, isSwayambhuHovered]);
  // Remove page state, use router instead

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    setArriving(loc);
  };

  const handleCountryChange = (val) => {
    setCountry(val);
    setCity('');
  };
  const handleCityChange = (val) => {
    setCity(val);
  };

  // Helper for recommendations order
  const getOrderedLocations = () => {
    if (selectedLocation === 'kathmandu') return ['kathmandu', 'pokhara'];
    return ['pokhara', 'kathmandu'];
  };

  // Helper for displaying origin
  const getOriginDisplay = () => {
    if (!country || !city) return '';
    return `${city}, ${country}`;
  };

  return (
    <>
      <style>{globalStyle}</style>
      <style>{themeStyle}</style>
      <style>{selectInputStyle}</style>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-0 px-2 relative">
        {/* Header Background Section */}
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2" style={{ minHeight: '520px' }}>
          <img
            src={headerImage}
            alt="Header background"
            className="w-screen h-[520px] object-cover object-center absolute top-0 left-0 z-0"
            style={{ filter: 'brightness(0.65)' }}
          />
          <div className="w-full flex flex-col items-center relative z-10 pt-8 pb-12">
            {/* Header */}
            <header className="w-full max-w-5xl flex justify-between items-center mb-8 text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: '#FFBFAE' }}>Yatra</span>
              </div>
              <nav className="flex gap-8 font-medium">
                <a href="#" className="hover:text-orange-300">Home</a>
                <a href="#" className="hover:text-orange-300">Discover</a>
                <a href="#" className="hover:text-orange-300">Special Deals</a>
                <a href="#" className="hover:text-orange-300">Contact</a>
              </nav>
              <div className="flex gap-4">
                <button className="px-4 py-2 rounded bg-white text-[#144D4A] font-semibold">Guest</button>
              </div>
            </header>
            {/* Tagline */}
            <div className="w-full flex justify-center mb-8">
              <span className="block text-4xl md:text-5xl font-extrabold text-center" style={{ color: '#FFBFAE', textShadow: '0 2px 16px #144D4A' }}>
                Travel like no one else...
              </span>
            </div>
            {/* Where are you coming from? Prompt */}
            <div className="w-full max-w-4xl mb-2 flex justify-center">
              <span className="block text-2xl font-bold text-white mb-2 text-center drop-shadow">Where are you coming from?</span>
            </div>
            {/* Location Selector (Taskbar) */}
            <section
              className="themed-taskbar w-full max-w-4xl rounded-full shadow flex flex-row items-center px-6 py-4 mb-8 gap-4 justify-center"
              tabIndex={0}
              style={{ boxShadow: '0 2px 16px 0 rgba(20,77,74,0.10)' }}
            >
              <div className={`flex flex-row gap-4 items-center w-full`}>
                {!country ? (
                  <div className="w-full">
                    <Select
                      classNamePrefix="custom-select"
                      options={[
                        // Common countries at the top
                        ...['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore']
                          .filter(c => countryCityData[c])
                          .map(c => ({ value: c, label: c })),
                        // Lesser-known countries
                        ...Object.keys(countryCityData)
                          .filter(c => !['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore'].includes(c))
                          .sort()
                          .map(c => ({ value: c, label: c }))
                      ]}
                      value={country ? { value: country, label: country } : null}
                      onChange={opt => handleCountryChange(opt ? opt.value : '')}
                      placeholder="Select Country"
                      isClearable
                      menuPlacement="auto"
                      menuPosition="fixed"
                      menuPortalTarget={document.body}
                      styles={{
                        control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '44px', boxShadow: '0 1px 4px #e0e7ef', borderColor: '#cbd5e1', width: '100%', background: '#144D4A', color: '#fff' }),
                        menu: (base) => ({ ...base, borderRadius: '1rem', maxHeight: '160px', width: '100%', overflowY: 'auto', background: '#144D4A', color: '#fff' }),
                        input: (base) => ({ ...base, color: PEACH_CORAL, background: '#144D4A' }),
                        singleValue: (base) => ({ ...base, textOverflow: 'ellipsis', whiteSpace: 'normal', overflow: 'hidden', fontSize: '0.95rem', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', color: PEACH_CORAL }),
                        option: (base, state) => ({ ...base, textOverflow: 'ellipsis', whiteSpace: 'normal', overflow: 'hidden', fontSize: '0.95rem', padding: '8px 12px', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', background: state.isFocused ? '#17605C' : '#144D4A', color: '#fff' }),
                        placeholder: (base) => ({ ...base, color: PEACH_CORAL }),
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-1/2">
                      <Select
                        classNamePrefix="custom-select"
                        options={[
                          // Common countries at the top
                          ...['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore']
                            .filter(c => countryCityData[c])
                            .map(c => ({ value: c, label: c })),
                          // Lesser-known countries
                          ...Object.keys(countryCityData)
                            .filter(c => !['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore'].includes(c))
                            .sort()
                            .map(c => ({ value: c, label: c }))
                        ]}
                        value={country ? { value: country, label: country } : null}
                        onChange={opt => handleCountryChange(opt ? opt.value : '')}
                        placeholder="Select Country"
                        isClearable
                        menuPlacement="auto"
                        menuPosition="fixed"
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '44px', boxShadow: '0 1px 4px #e0e7ef', borderColor: '#cbd5e1', width: '100%', background: '#144D4A', color: '#fff' }),
                          menu: (base) => ({ ...base, borderRadius: '1rem', maxHeight: '160px', width: '100%', overflowY: 'auto', background: '#144D4A', color: '#fff' }),
                          input: (base) => ({ ...base, color: PEACH_CORAL, background: '#144D4A' }),
                          singleValue: (base) => ({ ...base, textOverflow: 'ellipsis', whiteSpace: 'normal', overflow: 'hidden', fontSize: '0.95rem', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', color: PEACH_CORAL }),
                          option: (base, state) => ({ ...base, textOverflow: 'ellipsis', whiteSpace: 'normal', overflow: 'hidden', fontSize: '0.95rem', padding: '8px 12px', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', background: state.isFocused ? '#17605C' : '#144D4A', color: '#fff' }),
                          placeholder: (base) => ({ ...base, color: PEACH_CORAL }),
                        }}
                      />
                    </div>
                    <div className="w-1/2">
                      <Select
                        classNamePrefix="custom-select"
                        options={countryCityData[country].map(cityName => ({ value: cityName, label: cityName }))}
                        value={city ? { value: city, label: city } : null}
                        onChange={opt => handleCityChange(opt ? opt.value : '')}
                        placeholder="Select City"
                        isClearable
                        menuPlacement="auto"
                        menuPosition="fixed"
                        menuPortalTarget={document.body}
                        styles={{
                          control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '44px', boxShadow: '0 1px 4px #e0e7ef', borderColor: '#cbd5e1', width: '100%', background: '#144D4A', color: '#fff' }),
                          menu: (base) => ({ ...base, borderRadius: '1rem', maxHeight: '160px', width: '100%', overflowY: 'auto', background: '#144D4A', color: '#fff' }),
                          input: (base) => ({ ...base, color: PEACH_CORAL, background: '#144D4A' }),
                          singleValue: (base) => ({ ...base, textOverflow: 'ellipsis', whiteSpace: 'normal', overflow: 'hidden', fontSize: '0.95rem', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', color: PEACH_CORAL }),
                          option: (base, state) => ({ ...base, textOverflow: 'ellipsis', whiteSpace: 'normal', overflow: 'hidden', fontSize: '0.95rem', padding: '8px 12px', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', background: state.isFocused ? '#17605C' : '#144D4A', color: '#fff' }),
                          placeholder: (base) => ({ ...base, color: PEACH_CORAL }),
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
        {/* Add a gap below the header image */}
        <div className="h-8" />
        {/* Flight Overview */}
        {country && city && (
          <section className="w-full max-w-4xl flex flex-col items-center mb-8 mt-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <span>From</span>
              <span className="text-blue-600">{getOriginDisplay()}</span>
              <span>to</span>
              <span className="text-blue-600">{LOCATIONS.find(l => l.value === selectedLocation)?.label}</span>
              <span>✈️</span>
            </div>
          </section>
        )}

        {/* Recommendations Section */}
        <section className="w-full max-w-5xl">
          <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-wider">Top Destinations</h2>
          {getOrderedLocations().map(locKey => (
            <div key={locKey} className="mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Recommended in {LOCATIONS.find(l => l.value === locKey).label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RECOMMENDATIONS[locKey].map((rec, idx) => (
                  <div key={idx} className="themed-card rounded-2xl shadow overflow-hidden flex flex-col items-start" style={{ boxShadow: '0 2px 16px 0 rgba(20,77,74,0.10)' }}>
                    {/* Slideshow for Swayambhunath Stupa */}
                    {rec.name === 'Swayambhunath Stupa' ? (
                      <>
                        <div
                          className="w-full h-64 bg-gray-200 relative overflow-hidden group mb-4"
                          onMouseEnter={() => setIsSwayambhuHovered(true)}
                          onMouseLeave={() => { setIsSwayambhuHovered(false); setSwayambhuHoverSide(null); }}
                          onMouseMove={e => {
                            const bounds = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - bounds.left;
                            if (x < bounds.width / 3) setSwayambhuHoverSide('left');
                            else if (x > (2 * bounds.width) / 3) setSwayambhuHoverSide('right');
                            else setSwayambhuHoverSide(null);
                          }}
                        >
                          <img
                            src={swayambhuImages[swayambhuSlide]}
                            alt="Swayambhunath Stupa"
                            className="object-cover w-full h-full transition-all duration-500"
                          />
                          {/* Left overlay for previous */}
                          <div
                            className={`absolute left-0 top-0 h-full w-1/3 cursor-pointer transition-all duration-200 flex items-center pl-2
                              ${swayambhuHoverSide === 'left' ? 'bg-gradient-to-r from-black via-black/30 to-transparent opacity-80' : 'opacity-0'}`}
                            onClick={e => { e.stopPropagation(); setSwayambhuSlide((swayambhuSlide - 1 + swayambhuImages.length) % swayambhuImages.length); }}
                          >
                            {swayambhuHoverSide === 'left' && <ChevronLeftIcon className="h-10 w-10 text-white drop-shadow-lg opacity-90" />}
                          </div>
                          {/* Right overlay for next */}
                          <div
                            className={`absolute right-0 top-0 h-full w-1/3 cursor-pointer transition-all duration-200 flex items-center justify-end pr-2
                              ${swayambhuHoverSide === 'right' ? 'bg-gradient-to-l from-black via-black/30 to-transparent opacity-80' : 'opacity-0'}`}
                            onClick={e => { e.stopPropagation(); setSwayambhuSlide((swayambhuSlide + 1) % swayambhuImages.length); }}
                          >
                            {swayambhuHoverSide === 'right' && <ChevronRightIcon className="h-10 w-10 text-white drop-shadow-lg opacity-90" />}
                          </div>
                        </div>
                        {/* Dots below the image */}
                        <div className="w-full flex justify-center mb-1 mt-1">
                          <div className="flex gap-3">
                            {swayambhuImages.map((_, i) => (
                              <span
                                key={i}
                                className={`inline-block w-4 h-4 rounded-full transition-all duration-200 border-2 border-white shadow ${i === swayambhuSlide ? 'bg-blue-600 scale-110' : 'bg-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                        <span className="text-4xl">🏞️</span>
                      </div>
                    )}
                    <div className="p-6 w-full flex flex-col items-start">
                      <h4 className="font-bold text-lg mb-1">{rec.name}</h4>
                      <p className="mb-2" style={{ color: PEACH_CORAL }}>{rec.desc}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-600 font-semibold">{rec.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-orange-500 font-bold">{rec.rating}</span>
                        <span className="text-orange-400">★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
        {/* Next Button */}
        <Link
          to="/second"
          className="btn btn-primary fixed bottom-6 right-6 z-50"
        >
          Next
        </Link>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <style>{globalStyle}</style>
      <style>{themeStyle}</style>
      <style>{selectInputStyle}</style>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/second" element={<SecondPage onBack={() => window.history.back()} />} />
        </Routes>
      </Router>
    </>
  );
}
