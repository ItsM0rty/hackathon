import { useState } from 'react';
import SecondPage from './SecondPage';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import countryCityData from './data/countries-cities.json';

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

function MainPage() {
  const [selectedLocation, setSelectedLocation] = useState('kathmandu');
  const [arriving, setArriving] = useState('kathmandu');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
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
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 relative">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">Yatra</span>
        </div>
        <nav className="flex gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Discover</a>
          <a href="#" className="hover:text-blue-600">Special Deals</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </nav>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold">Guest</button>
        </div>
      </header>

      {/* Where are you coming from? Prompt */}
      <div className="w-full max-w-4xl mb-2 flex justify-center">
        <span className="block text-2xl font-bold text-gray-700 mb-2 text-center">Where are you coming from?</span>
      </div>

      {/* Hero Section */}
      {/* Location Selector */}
      <section className="w-full max-w-4xl bg-white rounded-full shadow flex flex-row items-center px-6 py-4 mb-8 gap-4 justify-center">
        <div className="flex flex-row gap-4 items-center">
          <select
            className="min-w-[200px] px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={country}
            onChange={e => handleCountryChange(e.target.value)}
          >
            <option value="">Select Country</option>
            {/* Common countries at the top */}
            {['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore'].map(c =>
              countryCityData[c] ? <option key={c} value={c}>{c}</option> : null
            )}
            {/* Lesser-known countries at the bottom */}
            {Object.keys(countryCityData)
              .filter(c => !['United States', 'India', 'United Kingdom', 'France', 'Japan', 'Australia', 'Canada', 'Singapore'].includes(c))
              .sort()
              .map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {country && (
            <select
              className="min-w-[200px] ml-2 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={city}
              onChange={e => handleCityChange(e.target.value)}
            >
              <option value="">Select City</option>
              {countryCityData[country].map(cityName => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* Flight Overview */}
      <section className="w-full max-w-4xl flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <span>From</span>
          <span className="text-blue-600">{getOriginDisplay()}</span>
          <span>to</span>
          <span className="text-blue-600">{LOCATIONS.find(l => l.value === selectedLocation)?.label}</span>
          <span>✈️</span>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase tracking-wider">Top Destinations</h2>
        {getOrderedLocations().map(locKey => (
          <div key={locKey} className="mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Recommended in {LOCATIONS.find(l => l.value === locKey).label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECOMMENDATIONS[locKey].map((rec, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
                  <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">🏞️</span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{rec.name}</h4>
                  <p className="text-gray-600 mb-2">{rec.desc}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 font-semibold">{rec.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500 font-bold">{rec.rating}</span>
                    <span className="text-orange-400">★</span>
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
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/second" element={<SecondPage onBack={() => window.history.back()} />} />
      </Routes>
    </Router>
  );
}
