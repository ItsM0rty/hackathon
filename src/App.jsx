import { useState, useEffect, useRef } from 'react';
import SecondPage from './SecondPage';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import flightPricingData from './data/flight-pricing.json';
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
import aiRecommendationService from './services/aiRecommendations';
// Dynamic loader for place data from Kathmandu and Pokhara folders
import { useMemo } from 'react';

const placeFolders = [
  { key: 'kathmandu', label: 'Kathmandu', folder: '/src/assets/landing page/Kathmandu' },
  { key: 'pokhara', label: 'Pokhara', folder: '/src/assets/landing page/Pokhara' },
];

function useDynamicPlaces() {
  // Import all text files and images from both folders
  const txtFiles = import.meta.glob('/src/assets/landing page/*/*.txt', { as: 'raw', eager: true });
  const imgFiles = import.meta.glob('/src/assets/landing page/*/*.{jpg,png,webp,avif,jfif}', { eager: true, as: 'url' });

  return useMemo(() => {
    const places = { kathmandu: [], pokhara: [] };
    for (const [txtPath, txtContent] of Object.entries(txtFiles)) {
      // Extract folder and base name
      const match = txtPath.match(/\/landing page\/(Kathmandu|Pokhara)\/([^/]+)\.txt$/);
      if (!match) continue;
      const folder = match[1].toLowerCase();
      const base = match[2];
      // Parse text file
      const lines = txtContent.split('\n').map(l => l.trim()).filter(Boolean);
      const name = lines[0] || base;
      const location = lines.find(l => l.startsWith('Location:'))?.replace('Location:', '').trim() || '';
      const description = lines.find(l => l.startsWith('Description:'))?.replace('Description:', '').trim() || '';
      const thingsStart = lines.findIndex(l => l.startsWith('Things to Do:'));
      let things = [];
      if (thingsStart !== -1) {
        things = lines.slice(thingsStart + 1).filter(l => l && !l.startsWith('Location:') && !l.startsWith('Description:'));
      }
      // Find images for this place
      const imgBase = base.replace(/\s+/g, ' ');
      const images = Object.entries(imgFiles)
        .filter(([imgPath]) => imgPath.includes(`/${match[1]}/`) && imgPath.match(new RegExp(imgBase + '( |\.|$)', 'i')))
        .map(([imgPath, url]) => ({ imgPath, url }));
      // Activity images: those with 'act' in the name, sorted by act number
      let activityImages = images
        .filter(({ imgPath }) => /act ?(\d)/i.test(imgPath))
        .sort((a, b) => {
          const aNum = parseInt((a.imgPath.match(/act ?(\d)/i) || [])[1] || '0', 10);
          const bNum = parseInt((b.imgPath.match(/act ?(\d)/i) || [])[1] || '0', 10);
          return aNum - bNum;
        })
        .map(({ url }) => url);
      // Main image: act 0 if present, else first image not an act image, else first image
      let mainImage = images.find(({ imgPath }) => /act ?0/i.test(imgPath));
      if (mainImage) mainImage = mainImage.url;
      else {
        const notAct = images.find(({ imgPath }) => !/act ?\d/i.test(imgPath));
        mainImage = notAct ? notAct.url : (images[0] ? images[0].url : undefined);
      }
      places[folder].push({
        name,
        location,
        description,
        things,
        mainImage,
        activityImages,
      });
    }
    // Sort by name for consistency
    places.kathmandu.sort((a, b) => a.name.localeCompare(b.name));
    places.pokhara.sort((a, b) => a.name.localeCompare(b.name));
    return places;
  }, [txtFiles, imgFiles]);
}

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

// Add Inter font from Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
if (!document.head.querySelector('link[href*="fonts.googleapis.com"]')) document.head.appendChild(fontLink);

const fontStyle = `
  html, body, * {
    font-family: 'Inter', system-ui, sans-serif !important;
    font-display: swap;
  }
`;

// Helper functions to extract data from flight pricing JSON
const getCountriesFromFlightData = () => {
  return Object.keys(flightPricingData.routes).sort();
};

const getCitiesForCountry = (country) => {
  const countryData = flightPricingData.routes[country];
  if (!countryData || !countryData.major_cities) return [];
  return Object.keys(countryData.major_cities).sort();
};

// Create countryCityData-like structure for compatibility
const countryCityData = {};
getCountriesFromFlightData().forEach(country => {
  countryCityData[country] = getCitiesForCountry(country);
});

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
    { name: 'Kathmandu Durbar Square', desc: 'Historic royal palace complex with stunning architecture', price: '$8', rating: 4.6 },
    { name: 'Hanuman Dhoka Palace', desc: 'Ancient royal palace with rich cultural heritage', price: '$6', rating: 4.5 },
    { name: 'Asan Bazaar', desc: 'Traditional market experience in the heart of Kathmandu', price: 'Free', rating: 4.3 },
    { name: 'Kumari Ghar', desc: 'Home of the living goddess Kumari', price: '$4', rating: 4.4 },
    { name: 'Narayanhiti Palace Museum', desc: 'Former royal palace turned museum', price: '$7', rating: 4.2 },
    { name: 'Chhauni Museum', desc: 'Military museum showcasing Nepal\'s history', price: '$5', rating: 4.1 },
  ],
  pokhara: [
    { name: 'Phewa Lake', desc: 'Boating and lakeside relaxation', price: '$15', rating: 4.9 },
    { name: 'Sarangkot', desc: 'Sunrise and paragliding spot', price: '$20', rating: 4.8 },
    { name: 'Davis Falls', desc: 'Scenic waterfall visit', price: '$3', rating: 4.6 },
    { name: 'World Peace Pagoda', desc: 'Enjoy panoramic views from the stupa', price: '$5', rating: 4.7 },
    { name: 'Gupteshwor Cave', desc: 'Explore the mystical cave', price: '$2', rating: 4.5 },
    { name: 'International Mountain Museum', desc: 'Learn about mountaineering history', price: '$10', rating: 4.4 },
    { name: 'Tal Barahi Temple', desc: 'Island temple in the middle of Phewa Lake', price: '$3', rating: 4.6 },
    { name: 'Mahendra Cave', desc: 'Natural limestone cave formation', price: '$2', rating: 4.3 },
    { name: 'Bindyabasini Temple', desc: 'Sacred Hindu temple with mountain views', price: 'Free', rating: 4.4 },
    { name: 'Begnas Lake', desc: 'Peaceful lake perfect for boating and fishing', price: '$8', rating: 4.5 },
    { name: 'Annapurna Base Camp Trek', desc: 'Multi-day trekking adventure to Annapurna Base Camp', price: '$400', rating: 4.9 },
    { name: 'Paragliding Adventure', desc: 'Tandem paragliding with stunning Himalayan views', price: '$80', rating: 4.8 },
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

function MainPage({ selectedActivities, setSelectedActivities, selectedOrigin, setSelectedOrigin }) {
  const [selectedLocation, setSelectedLocation] = useState('kathmandu');
  const [arriving, setArriving] = useState('kathmandu');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [headerSolid, setHeaderSolid] = useState(false);
  // Using selectedActivities and setSelectedActivities from props
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPlaceAdded, setShowPlaceAdded] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const navigate = useNavigate();
  const topDestRef = useRef(null);
  const [bookingFloat, setBookingFloat] = useState(false);
  // Card slideshow state: one per card
  const [cardSlides, setCardSlides] = useState({}); // { [placeName]: idx }
  const [hoverStates, setHoverStates] = useState({}); // { [placeName]: 'left'|'right'|null }
  const places = useDynamicPlaces();
  
  // AI Recommendation state
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [userPreferences, setUserPreferences] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
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
  const toggleRecommendation = (rec, cityKey) => {
    console.log('🎯 toggleRecommendation called with:', rec, 'city:', cityKey);
    setSelectedActivities((prev) => {
      const exists = prev.find(r => r.name === rec.name && r.description === rec.description);
      if (exists) {
        console.log('❌ Removing activity:', rec.name);
        return prev.filter(r => !(r.name === rec.name && r.description === rec.description));
      } else {
        setShowPlaceAdded(true);
        setTimeout(() => setShowPlaceAdded(false), 2000);
        
        // Standardize the activity format for SecondPage.jsx
        const standardizedActivity = {
          name: rec.name,
          description: rec.description || rec.desc,
          price: rec.price,
          rating: rec.rating,
          location: rec.location,
          // Add city information - this is crucial for SecondPage to categorize correctly
          city: cityKey, // 'kathmandu' or 'pokhara'
          // Keep original data for debugging
          originalData: rec
        };
        
        console.log('✅ Adding standardized activity:', standardizedActivity);
        const newActivities = [...prev, standardizedActivity];
        console.log('📋 New selectedActivities array:', newActivities);
        return newActivities;
      }
    });
  };

  // AI Recommendation handler
  const handleAIRecommendations = async () => {
    if (!userPreferences.trim()) {
      alert('Please enter your preferences first!');
      return;
    }

    setIsLoadingAI(true);
    
    try {
      // Get all available activities from both cities
      const allActivities = [
        ...places.kathmandu.map(place => ({ ...place, city: 'kathmandu' })),
        ...places.pokhara.map(place => ({ ...place, city: 'pokhara' })),
        ...RECOMMENDATIONS.kathmandu.map(rec => ({ 
          name: rec.name, 
          description: rec.desc, 
          city: 'kathmandu',
          price: rec.price,
          rating: rec.rating 
        })),
        ...RECOMMENDATIONS.pokhara.map(rec => ({ 
          name: rec.name, 
          description: rec.desc, 
          city: 'pokhara',
          price: rec.price,
          rating: rec.rating 
        }))
      ];

      console.log('🤖 Getting AI recommendations for:', userPreferences);
      console.log('📋 Available activities:', allActivities.length);

      const recommendations = await aiRecommendationService.getRecommendations(
        userPreferences, 
        allActivities,
        'deepseek' // Prefer DeepSeek for speed
      );

      setAiRecommendations(recommendations);
      
      // Auto-select recommended activities
      if (recommendations.recommendations && recommendations.recommendations.length > 0) {
        recommendations.recommendations.forEach(rec => {
          // Find the matching activity
          const matchingActivity = allActivities.find(activity => 
            activity.name === rec.activityName
          );
          
          if (matchingActivity) {
            // Create standardized activity object
            const standardizedActivity = {
              name: matchingActivity.name,
              description: matchingActivity.description || rec.reasoning,
              price: matchingActivity.price,
              rating: matchingActivity.rating,
              location: matchingActivity.location,
              city: rec.city,
              aiRecommended: true,
              matchScore: rec.matchScore,
              originalData: matchingActivity
            };
            
            // Add to selected activities if not already selected
            setSelectedActivities(prev => {
              const exists = prev.find(r => r.name === matchingActivity.name);
              if (!exists) {
                console.log(`✅ Auto-selecting: ${matchingActivity.name} (Score: ${rec.matchScore})`);
                return [...prev, standardizedActivity];
              }
              return prev;
            });
          }
        });
        
        setShowPlaceAdded(true);
        setTimeout(() => setShowPlaceAdded(false), 3000);
      }
      
    } catch (error) {
      console.error('❌ AI Recommendation failed:', error);
      alert('AI recommendations temporarily unavailable. Please try selecting activities manually.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Auto-rotate Swayambhu images
  // Remove page state, use router instead

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    setArriving(loc);
  };

  const handleCountryChange = (val) => {
    setCountry(val);
    setCity('');
    // Update the selected origin
    setSelectedOrigin(prev => ({
      ...prev,
      country: val,
      city: ''
    }));
  };
  const handleCityChange = (val) => {
    setCity(val);
    // Update the selected origin
    setSelectedOrigin(prev => ({
      ...prev,
      city: val
    }));
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

  // Helper to extract description before em dash
  function shortDescription(desc) {
    if (!desc) return '';
    const idx = desc.indexOf('—');
    return idx !== -1 ? desc.slice(0, idx).trim() : desc;
  }

  return (
    <>
      <style>{globalStyle}</style>
      <style>{fontStyle}</style>
      <style>{themeStyle}</style>
      <style>{selectInputStyle}</style>
      <style>{`
.custom-select__menu {
  border-radius: 1rem !important;
  border: 2px solid #144D4A !important;
  background: #fff !important;
  box-shadow: 0 4px 24px 0 rgba(20,77,74,0.18) !important;
  overflow: hidden !important;
  z-index: 9999 !important;
}
.custom-select__option {
  background: #fff !important;
  color: #144D4A !important;
  border-bottom: 1px solid #f0f0f0 !important;
}
.custom-select__option--is-focused {
  background: #FFBFAE !important;
  color: #144D4A !important;
}
.custom-select__option--is-selected {
  background: #F26B3A !important;
  color: #fff !important;
}
.custom-select__menu-list {
  max-height: 160px !important;
  padding: 0 !important;
  overflow-y: auto !important;
}
`}</style>
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
          <div className="w-full flex justify-between items-center px-16 py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="focus:outline-none">
                <img src={logoImg} alt="Yaan Logo" className="h-10 w-auto mt-2" />
              </button>
            </div>
            <nav className="flex gap-8 font-medium text-gray-800">
              <a href="#" className="hover:text-orange-500">Home</a>
              <a href="#" className="hover:text-orange-500">Discover</a>
              <a href="#" className="hover:text-orange-500">Special Deals</a>
              <a href="#" className="hover:text-orange-500">Contact</a>
            </nav>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <img src={guestImg} alt="Guest" className="h-10 w-10 object-contain" />
                <span className="font-medium text-gray-800 text-lg">Guest</span>
              </div>
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
        
        {/* Minimal Suggestion Section */}
        <section className="w-full max-w-4xl mb-8">
          <div className="rounded-2xl shadow-lg p-6 bg-white">
            <h3 className="text-2xl font-bold mb-4 text-black">Suggest me</h3>
            <div className="space-y-4">
              <div>
                <textarea
                  value={userPreferences}
                  onChange={(e) => setUserPreferences(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full p-4 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows="2"
                  style={{ fontSize: '1rem' }}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={handleAIRecommendations}
                  disabled={isLoadingAI || !userPreferences.trim()}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{ fontSize: '1rem' }}
                >
                  {isLoadingAI ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>Suggest me</>
                  )}
                </button>
                {aiRecommendations && (
                  <div className="text-right">
                    <div className="text-sm text-black">
                      {aiRecommendations.recommendations?.length || 0} suggestions found
                    </div>
                    {aiRecommendations.summary && (
                      <div className="text-xs text-gray-700 max-w-xs">
                        {aiRecommendations.summary}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Minimal Recommendations Display */}
              {aiRecommendations && aiRecommendations.recommendations && aiRecommendations.recommendations.length > 0 && (
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="space-y-3">
                    {aiRecommendations.recommendations.slice(0, 5).map((rec, index) => (
                      <div key={index} className="rounded-lg p-3 border-l-4 border-black bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-black">{rec.activityName}</h5>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-medium">
                              {rec.matchScore}% match
                            </span>
                            <span className="text-xs text-gray-700 capitalize">{rec.city}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-800">{rec.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

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
          <h2 className="text-2xl font-bold text-[#144D4A] mb-6">Top Destinations</h2>
          {places.kathmandu.length === 0 && places.pokhara.length === 0 && (
            <div className="text-center text-red-600 font-bold my-8">
              No places found. Check your folder and file names.<br/>
              <div className="themed-card rounded-2xl shadow overflow-hidden flex flex-col items-start cursor-pointer transition-all duration-200 border-2 relative w-80 mx-auto mt-8">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">🏞️</span>
                </div>
                <div className="p-6 w-full flex flex-col items-start">
                  <div className="flex items-center justify-between w-full mb-1">
                    <h4 className="font-bold text-lg">Sample Place</h4>
                    <span className="text-green-600 font-semibold">$20</span>
                  </div>
                  <p className="mb-2" style={{ color: PEACH_CORAL }}>Sample description</p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-orange-500 font-bold">4.8</span>
                    <span className="text-orange-400">★</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {getOrderedLocations().map(locKey => {
            // Use dynamic places as primary, hardcoded as backup only if no dynamic places exist
            const dynamicPlaces = places[locKey] || [];
            const hardcodedRecs = RECOMMENDATIONS[locKey] || [];
            
            let allPlaces;
            if (dynamicPlaces.length > 0) {
              // Use dynamic places (they have all the images and data from folders)
              allPlaces = dynamicPlaces;
            } else {
              // Fallback to hardcoded recommendations only if no dynamic places found
              allPlaces = hardcodedRecs.map(rec => ({
                name: rec.name,
                description: rec.desc,
                price: rec.price,
                rating: rec.rating,
                mainImage: undefined,
                activityImages: []
              }));
            }
            
            return (
              <div key={locKey} className="mb-12">
                <h3 className="text-2xl font-bold text-[#F26B3A] mb-6">Recommended in {LOCATIONS.find(l => l.value === locKey).label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {allPlaces.map((place, idx) => {
                    // Create complete place object first for comparison
                    const completePlace = {
                      ...place,
                      price: place.price || ('$' + (10 + (idx % 5) * 5)),
                      rating: place.rating || (4.5 + (idx % 5) * 0.1)
                    };
                    
                    const selected = selectedActivities.find(r => r.name === place.name && r.description === place.description);
                    const slideIdx = cardSlides[place.name] || 0;
                    // Use only the sorted activityImages (act 0, act 1, act 2, act 3) for the slideshow
                    let images = place.activityImages && place.activityImages.length === 4
                      ? place.activityImages
                      : [place.mainImage, ...place.activityImages].filter(Boolean).slice(0, 4);
                    // Get hover state for this card
                    const hoverSide = hoverStates[place.name] || null;
                  
                  return (
                    <div
                      key={place.name}
                      className={`themed-card rounded-2xl shadow overflow-hidden flex flex-col items-start cursor-pointer transition-all duration-200 border-2 relative ${selected ? 'border-orange-400 bg-[#F26B3A] text-white' : ''}`}
                      style={{ boxShadow: '0 2px 16px 0 rgba(20,77,74,0.10)' }}
                      onClick={() => toggleRecommendation(completePlace, locKey)}
                    >
                      {/* Checkmark for selected */}
                      {selected && (
                        <span className="absolute top-3 right-3 z-20">
                          <CheckCircleIcon className="h-7 w-7 text-green-400 drop-shadow-lg" style={{ color: '#22c55e', background: 'white', borderRadius: '50%' }} />
                        </span>
                      )}
                      {/* Slideshow for images */}
                      <div
                        className="w-full h-64 bg-gray-200 relative overflow-hidden group mb-4"
                        onMouseMove={e => {
                          const bounds = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - bounds.left;
                          if (x < bounds.width / 3) setHoverStates(prev => ({ ...prev, [place.name]: 'left' }));
                          else if (x > (2 * bounds.width) / 3) setHoverStates(prev => ({ ...prev, [place.name]: 'right' }));
                          else setHoverStates(prev => ({ ...prev, [place.name]: null }));
                        }}
                        onMouseLeave={() => setHoverStates(prev => ({ ...prev, [place.name]: null }))}
                      >
                        {images.length > 0 ? (
                          <img
                            src={images[slideIdx % images.length]}
                            alt={place.name}
                            className="object-cover w-full h-full transition-all duration-500"
                          />
                        ) : (
                          <span className="text-4xl flex items-center justify-center w-full h-full">🏞️</span>
                        )}
                        {/* Left overlay for previous with shadow, only show if hoverSide is 'left' */}
                        {hoverSide === 'left' && (
                          <div
                            className="absolute left-0 top-0 h-full w-1/2 cursor-pointer flex items-center pl-2 z-10 opacity-100 transition-opacity duration-200"
                            onClick={e => { e.stopPropagation(); setCardSlides(s => ({ ...s, [place.name]: (slideIdx - 1 + images.length) % images.length })); }}
                          >
                            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-black/40 via-black/10 via-transparent to-transparent pointer-events-none" />
                            <ChevronLeftIcon className="h-8 w-8 text-white drop-shadow-lg relative" />
                          </div>
                        )}
                        {/* Right overlay for next with shadow, only show if hoverSide is 'right' */}
                        {hoverSide === 'right' && (
                          <div
                            className="absolute right-0 top-0 h-full w-1/2 cursor-pointer flex items-center justify-end pr-2 z-10 opacity-100 transition-opacity duration-200"
                            onClick={e => { e.stopPropagation(); setCardSlides(s => ({ ...s, [place.name]: (slideIdx + 1) % images.length })); }}
                          >
                            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-black/40 via-black/10 via-transparent to-transparent pointer-events-none" />
                            <ChevronRightIcon className="h-8 w-8 text-white drop-shadow-lg relative" />
                          </div>
                        )}
                      </div>
                      {/* Paginator dots below the image and above the name */}
                      {images.length > 1 && (
                        <div className="w-full flex justify-center gap-1 mb-2">
                          {images.map((_, i) => (
                            <span
                              key={i}
                              className={`inline-block w-2 h-2 rounded-full transition-all duration-200 ${i === slideIdx % images.length ? 'bg-blue-600 scale-110' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                      <div className="p-6 w-full flex flex-col items-start">
                        <div className="flex items-center justify-between w-full mb-1">
                          <h4 className="font-bold text-lg">{place.name}</h4>
                          <span className="text-green-600 font-semibold">{completePlace.price}</span>
                        </div>
                        <p className="mb-2 text-gray-900">{shortDescription(place.description)}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-orange-500 font-bold">{completePlace.rating.toFixed(1)}</span>
                          <span className="text-orange-400">★</span>
                        </div>
                        {/* Location removed as requested */}
                        {/* Optionally, show things to do as a tooltip or on click if you want */}
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            );
          })}
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
          <div className="fixed z-50 right-6 top-44 flex flex-col items-end" style={{ minWidth: 320, maxWidth: 360 }}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full relative border border-gray-200" style={{ maxHeight: 400, overflowY: 'auto' }}>
              <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700" onClick={() => setShowBookingModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4 text-[#144D4A]">Your Selected Places</h2>
              {selectedActivities.length === 0 ? (
                <p className="text-gray-500">No places selected yet.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedActivities.map((rec, i) => (
                    <li key={i} className="flex flex-col border-b pb-2">
                      <span className="font-semibold text-[#144D4A]">{rec.name}</span>
                      <span className="text-sm text-gray-600">{rec.description}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="mt-6 w-full py-2 rounded bg-[#144D4A] text-white font-bold hover:bg-[#17605C] transition"
                onClick={() => { setShowBookingModal(false); navigate('/second'); }}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* Booking Button: fixed at top right at all times */}
        {selectedActivities.length > 0 && (
        <div className="fixed right-6 top-24 z-50 flex flex-col items-end transition-all duration-300">
          <div className="relative">
            <button
              className="rounded-full shadow-lg bg-white p-2 hover:scale-105 transition-transform border-2 border-[#144D4A]"
              onClick={() => setShowBookingModal(true)}
              style={{ width: 64, height: 64 }}
            >
              <img src={bookingImg} alt="Booking" className="w-full h-full object-contain" />
            </button>
            {showPlaceAdded && (
              <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow-lg animate-fadeinout transition-opacity duration-700 whitespace-nowrap">
                Place Added
              </div>
            )}
          </div>
        </div>
        )}
        {/* Footer */}
        <footer className="w-full bg-[#F8FAFC] text-gray-800 mt-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-start">
              <img src={logoImg} alt="Yaan Logo" className="h-12 w-auto mb-2" />
              <p className="mt-2 text-sm text-gray-500">Travel made easy and memorable.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-[#144D4A]">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500 transition">Home</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Discover</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Special Deals</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-[#144D4A]">Support</h4>
              <ul className="space-y-2">
                <li>Email: <a href="mailto:info@yaan.com" className="underline hover:text-orange-500 transition">info@yaan.com</a></li>
                <li>Phone: <a href="tel:+1234567890" className="underline hover:text-orange-500 transition">+1 234 567 890</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-[#144D4A]">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500 bg-[#F8FAFC]">
            &copy; {new Date().getFullYear()} Yaan. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}

export default function App() {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState({
    country: '',
    city: ''
  });

  return (
    <>
      <style>{globalStyle}</style>
      <style>{fontStyle}</style>
      <style>{themeStyle}</style>
      <style>{selectInputStyle}</style>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} selectedOrigin={selectedOrigin} setSelectedOrigin={setSelectedOrigin} />} />
          <Route path="/second" element={<SecondPage selectedActivities={selectedActivities} selectedOrigin={selectedOrigin} onBack={() => window.history.back()} />} />
        </Routes>
      </Router>
    </>
  );
}