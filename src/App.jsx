import { useState, useEffect, useRef } from 'react';
import SecondPage from './SecondPage';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import countryCityData from './data/countries-cities.json';
import Select from 'react-select';
import syambhu0 from './assets/landing page/syambhu.jpg';
import syambhu1 from './assets/landing page/syambhu1.jpg';
import syambhu2 from './assets/landing page/syambhu2.jpg';
import syambhu3 from './assets/landing page/syambhu3.jpg';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import headerImage from './assets/landing page/Header image.jpg';
import bookingImg from './assets/landing page/booking.png';
import logoImg from './assets/landing page/LOGO.png';
import guestImg from './assets/landing page/guest.png';

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
    { name: 'Garden of Dreams', desc: 'Relax in a historic neo-classical garden', price: '$3', rating: 4.4 },
    { name: 'Durbar Square', desc: 'Explore the ancient royal palace complex', price: '$8', rating: 4.6 },
    { name: 'Boudhanath Stupa', desc: 'Marvel at one of the largest stupas in the world', price: '$5', rating: 4.9 },
  ],
  pokhara: [
    { name: 'Phewa Lake', desc: 'Boating and lakeside relaxation', price: '$15', rating: 4.9 },
    { name: 'Sarangkot', desc: 'Sunrise and paragliding spot', price: '$20', rating: 4.8 },
    { name: 'Davis Falls', desc: 'Scenic waterfall visit', price: '$3', rating: 4.6 },
    { name: 'World Peace Pagoda', desc: 'Enjoy panoramic views from the stupa', price: '$5', rating: 4.7 },
    { name: 'Gupteshwor Cave', desc: 'Explore the mystical cave', price: '$2', rating: 4.5 },
    { name: 'International Mountain Museum', desc: 'Learn about mountaineering history', price: '$10', rating: 4.4 },
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
    background: #fff;
    color: #144D4A;
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
    background: #fff;
    color: #144D4A;
    border: 2px solid transparent;
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
  const [headerSolid, setHeaderSolid] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPlaceAdded, setShowPlaceAdded] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const navigate = useNavigate();
  const topDestRef = useRef(null);
  const [bookingFloat, setBookingFloat] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setHeaderSolid(scrollY > 650);
      setShowNextButton(scrollY > 700);
      if (topDestRef.current) {
        const rect = topDestRef.current.getBoundingClientRect();
        setBookingFloat(rect.top < 80); // 80px from top
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const toggleRecommendation = (rec) => {
    setSelectedRecommendations((prev) => {
      const exists = prev.find(r => r.name === rec.name && r.desc === rec.desc);
      if (exists) {
        return prev.filter(r => !(r.name === rec.name && r.desc === rec.desc));
      } else {
        setShowPlaceAdded(true);
        setTimeout(() => setShowPlaceAdded(false), 2000);
        return [...prev, rec];
      }
    });
  };

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
      <style>{`
@keyframes fadeinout {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
.animate-fadeinout { animation: fadeinout 2s; }
`}</style>
      <div className="min-h-screen flex flex-col items-center py-0 px-2 relative" style={{ background: '#FFF8F0' }}>
        {/* Sticky/Overlay Header */}
        <header
          className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${headerSolid ? 'bg-white/95 shadow-lg border-b border-gray-200' : 'bg-white/80'} backdrop-blur-md`}
          style={{ minHeight: '72px' }}
        >
          <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-8 py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="focus:outline-none">
                <img src={logoImg} alt="Yatra Logo" className="h-10 w-auto" />
              </button>
            </div>
            <nav className="flex gap-8 font-medium text-gray-800">
              <a href="#" className="hover:text-orange-500">Home</a>
              <a href="#" className="hover:text-orange-500">Discover</a>
              <a href="#" className="hover:text-orange-500">Special Deals</a>
              <a href="#" className="hover:text-orange-500">Contact</a>
            </nav>
            <div className="flex gap-4">
              <button className="rounded-full bg-white shadow border border-gray-300 p-1 hover:scale-105 transition-transform focus:outline-none" style={{ width: 44, height: 44 }}>
                <img src={guestImg} alt="Guest" className="w-full h-full object-contain" />
              </button>
            </div>
          </div>
        </header>
        {/* Header Background Section */}
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2" style={{ minHeight: '700px' }}>
          <img
            src={headerImage}
            alt="Header background"
            className="w-screen h-[700px] object-cover object-center absolute top-0 left-0 z-0"
            style={{ filter: 'brightness(0.65)' }}
          />
          {/* Overlay content at the bottom of the image */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col items-center z-10 pb-12">
            {/* Tagline */}
            <span className="block text-4xl md:text-5xl font-extrabold text-center mb-4" style={{ color: '#FFBFAE', textShadow: '0 2px 16px #144D4A' }}>
              Travel like no one else...
            </span>
            {/* Where are you coming from? Prompt */}
            <div className="w-full max-w-4xl mb-2 flex justify-center">
              <span className="block text-2xl font-bold text-white mb-2 text-center drop-shadow">Where are you coming from?</span>
            </div>
            {/* Location Selector (Taskbar) */}
            <section
              className="themed-taskbar w-full max-w-4xl rounded-full shadow flex flex-row items-center px-6 py-4 mb-0 gap-4 justify-center"
              tabIndex={0}
              style={{ boxShadow: '0 2px 16px 0 rgba(20,77,74,0.10)' }}
            >
              <div className={`flex flex-row gap-4 items-center w-full`}>
                <div className={!country ? 'w-full' : 'w-1/2'}>
                  <Select
                    classNamePrefix="custom-select"
                    options={[
                      ...['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore']
                        .filter(c => countryCityData[c])
                        .map(c => ({ value: c, label: c })),
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
                      control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '44px', width: '100%' }),
                      menu: (base) => ({ ...base, borderRadius: '1rem', maxHeight: '160px', width: '100%' }),
                    }}
                  />
                </div>
                {country && (
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
                        control: (base) => ({ ...base, borderRadius: '1rem', minHeight: '44px', width: '100%' }),
                        menu: (base) => ({ ...base, borderRadius: '1rem', maxHeight: '160px', width: '100%' }),
                      }}
                    />
                  </div>
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
        <section className="w-full max-w-5xl" ref={topDestRef}>
          <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-wider">Top Destinations</h2>
          {getOrderedLocations().map(locKey => (
            <div key={locKey} className="mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Recommended in {LOCATIONS.find(l => l.value === locKey).label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RECOMMENDATIONS[locKey].map((rec, idx) => (
                  <div
                    key={idx}
                    className={`themed-card rounded-2xl shadow overflow-hidden flex flex-col items-start cursor-pointer transition-all duration-200 border-2 relative ${selectedRecommendations.find(r => r.name === rec.name && r.desc === rec.desc) ? 'border-orange-400 bg-[#F26B3A] text-white' : ''}`}
                    style={{ boxShadow: '0 2px 16px 0 rgba(20,77,74,0.10)' }}
                    onClick={() => toggleRecommendation(rec)}
                  >
                    {/* Checkmark for selected */}
                    {selectedRecommendations.find(r => r.name === rec.name && r.desc === rec.desc) && (
                      <span className="absolute top-3 right-3 z-20">
                        <CheckCircleIcon className="h-7 w-7 text-green-400 drop-shadow-lg" />
                      </span>
                    )}
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
                              ${swayambhuHoverSide === 'left' ? 'bg-gradient-to-r from-black/30 via-black/10 to-transparent opacity-80' : 'opacity-0'}`}
                            onClick={e => { e.stopPropagation(); setSwayambhuSlide((swayambhuSlide - 1 + swayambhuImages.length) % swayambhuImages.length); }}
                          >
                            {swayambhuHoverSide === 'left' && <ChevronLeftIcon className="h-10 w-10 text-white drop-shadow-lg opacity-100" />}
                          </div>
                          {/* Right overlay for next */}
                          <div
                            className={`absolute right-0 top-0 h-full w-1/3 cursor-pointer transition-all duration-200 flex items-center justify-end pr-2
                              ${swayambhuHoverSide === 'right' ? 'bg-gradient-to-l from-black/30 via-black/10 to-transparent opacity-80' : 'opacity-0'}`}
                            onClick={e => { e.stopPropagation(); setSwayambhuSlide((swayambhuSlide + 1) % swayambhuImages.length); }}
                          >
                            {swayambhuHoverSide === 'right' && <ChevronRightIcon className="h-10 w-10 text-white drop-shadow-lg opacity-100" />}
                          </div>
                        </div>
                        {/* Dots inside the image at the bottom center */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                          {swayambhuImages.map((_, i) => (
                            <span
                              key={i}
                              className={`inline-block w-2 h-2 rounded-full transition-all duration-200 border border-white shadow ${i === swayambhuSlide ? 'bg-blue-600 scale-110' : 'bg-gray-300'}`}
                            />
                          ))}
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
        {/* Floating Next Button (appears after scroll) */}
        {showNextButton && (
          <button
            className="fixed bottom-6 right-6 z-50 px-8 py-3 rounded-full bg-[#F26B3A] text-white font-bold shadow-lg hover:bg-orange-500 transition"
            onClick={() => navigate('/second')}
          >
            Next
          </button>
        )}
        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative">
              <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700" onClick={() => setShowBookingModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-[#144D4A]">Your Selected Places</h2>
              {selectedRecommendations.length === 0 ? (
                <p className="text-gray-500">No places selected yet.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedRecommendations.map((rec, i) => (
                    <li key={i} className="flex flex-col border-b pb-2">
                      <span className="font-semibold text-[#144D4A]">{rec.name}</span>
                      <span className="text-sm text-gray-600">{rec.desc}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button className="mt-6 w-full py-2 rounded bg-[#144D4A] text-white font-bold hover:bg-[#17605C] transition">Next</button>
            </div>
          </div>
        )}
        {/* Booking Button: fixed at top right at all times */}
        <div className="fixed right-6 top-24 z-50 flex flex-col items-end transition-all duration-300">
          <button
            className="rounded-full shadow-lg bg-white p-2 hover:scale-105 transition-transform border-2 border-[#144D4A]"
            onClick={() => setShowBookingModal(true)}
            style={{ width: 64, height: 64 }}
          >
            <img src={bookingImg} alt="Booking" className="w-full h-full object-contain" />
          </button>
          {showPlaceAdded && (
            <div className="mt-3 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow-lg animate-fadeinout transition-opacity duration-700">
              Place Added
            </div>
          )}
        </div>
        {/* Footer */}
        <footer className="w-full bg-[#F8FAFC] text-gray-800 py-6 mt-16 flex flex-col items-center gap-2 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between w-full max-w-5xl px-4 items-center">
            <span className="font-bold">&copy; {new Date().getFullYear()} Yatra</span>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center mt-2 md:mt-0">
              <span>Email: <a href="mailto:info@yatra.com" className="underline">info@yatra.com</a></span>
              <span>Phone: <a href="tel:+1234567890" className="underline">+1 234 567 890</a></span>
            </div>
          </div>
        </footer>
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
