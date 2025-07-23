import { useState } from 'react';

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

const COUNTRIES = [
  { label: 'United States', value: 'us', states: ['California', 'New York', 'Texas', 'Florida', 'Illinois'] },
  { label: 'India', value: 'india', states: ['Delhi', 'Maharashtra', 'Karnataka', 'West Bengal', 'Tamil Nadu'] },
  { label: 'United Kingdom', value: 'uk', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { label: 'Nepal', value: 'nepal', states: ['Bagmati', 'Gandaki', 'Lumbini', 'Province 1', 'Province 2'] },
  { label: 'Other', value: 'other', states: [] },
];

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState('kathmandu');
  const [arriving, setArriving] = useState('kathmandu');
  const [country, setCountry] = useState('us');
  const [state, setState] = useState('California');

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    setArriving(loc);
  };

  const handleCountryChange = (val) => {
    setCountry(val);
    const found = COUNTRIES.find(c => c.value === val);
    setState(found && found.states.length > 0 ? found.states[0] : '');
  };

  const handleStateChange = (val) => {
    setState(val);
  };

  // Helper for recommendations order
  const getOrderedLocations = () => {
    if (selectedLocation === 'kathmandu') return ['kathmandu', 'pokhara'];
    return ['pokhara', 'kathmandu'];
  };

  // Helper for displaying origin
  const getOriginDisplay = () => {
    const countryObj = COUNTRIES.find(c => c.value === country);
    if (!countryObj) return '';
    if (countryObj.states.length > 0 && state) {
      return `${state}, ${countryObj.label}`;
    }
    return countryObj.label;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2">
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

      {/* Hero Section */}
      {/* Location Selector */}
      <section className="w-full max-w-4xl bg-white rounded-full shadow flex flex-row items-center px-6 py-4 mb-8 gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Where are you coming from?</span>
            <select
              className="mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={country}
              onChange={e => handleCountryChange(e.target.value)}
            >
              {COUNTRIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {COUNTRIES.find(c => c.value === country)?.states.length > 0 && (
              <select
                className="mt-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={state}
                onChange={e => handleStateChange(e.target.value)}
              >
                {COUNTRIES.find(c => c.value === country).states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500">City</span>
          <span className="mt-1 px-4 py-2 rounded-full border border-gray-300 bg-gray-50 font-semibold">Kathmandu</span>
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
        <div className="w-full h-2 flex items-center justify-center mt-2">
          <div className="w-2/3 h-1 bg-blue-200 rounded-full relative">
            <div className="absolute left-0 -top-2 text-blue-600 text-xs">{getOriginDisplay()}</div>
            <div className="absolute right-0 -top-2 text-blue-600 text-xs">{LOCATIONS.find(l => l.value === selectedLocation)?.label}</div>
          </div>
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
    </div>
  );
}
