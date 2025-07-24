import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, BuildingOffice2Icon, TicketIcon, MapPinIcon, XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

// Web fonts - adding premium typography
const WebFonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Playfair Display', serif; }
      .font-sans { font-family: 'Inter', sans-serif; }
      .gradient-border {
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6) border-box;
        border: 2px solid transparent;
      }
      .glass-effect {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .premium-shadow {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
    `}
  </style>
);

// Enhanced AirlineLogo component
const AirlineLogo = ({ airlineName, className = "" }) => {
  const logos = {
    'qatar airways': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Qatar_Airways_Logo.svg',
    'air india': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Air_India_Logo.svg',
    'emirates': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Emirates_logo.svg'
  };
  const fallbackLogo = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  const normalized = (airlineName || '').toLowerCase().trim();
  const logoUrl = logos[normalized] || fallbackLogo;
  return (
    <div className={`flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 ${className}`}>
      <img 
        src={logoUrl} 
        alt={airlineName} 
        className="h-12 w-auto object-contain"
      />
    </div>
  );
};

// Enhanced Travel Mode Selector Component
const TravelModeSelector = ({ mode, onChange, selectedTravel, options, onTravelChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100 rounded-xl p-1">
        {['Flight', 'Bus'].map((modeOption) => (
          <button
            key={modeOption}
            onClick={() => onChange(modeOption)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              mode === modeOption
                ? 'bg-white text-cyan-700 shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {modeOption === 'Flight' ? '✈️ Flight' : '🚌 Bus'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {options.map((travel) => (
          <div
            key={travel.id}
            onClick={() => onTravelChange(travel.id)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
              selectedTravel.id === travel.id
                ? 'border-cyan-500 bg-cyan-50 shadow-lg transform scale-105'
                : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedTravel.id === travel.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
                }`}>
                  {selectedTravel.id === travel.id && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{travel.name}</p>
                  <p className="text-sm text-gray-600">{travel.type}</p>
                  {travel.recommended && (
                    <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                      ⭐ Recommended
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-cyan-700">${travel.price}</p>
                <p className="text-xs text-gray-500">{mode === 'Flight' ? '~45min' : '~6hrs'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dummy data with enhanced information
const dummyFlights = [
  { id: 1, airline: 'Qatar Airways', price: 843, from: 'JFK', to: 'KTM', layovers: ['DOH'], duration: '18h 30m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Qatar_Airways_Logo.svg' },
  { id: 2, airline: 'Air India', price: 864, from: 'JFK', to: 'KTM', layovers: ['DEL'], duration: '19h 15m', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Air_India_Logo.svg' },
  { id: 3, airline: 'Emirates', price: 910, from: 'JFK', to: 'KTM', layovers: ['DXB'], duration: '20h 10m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Emirates_logo.svg' }
];

const dummyHotels = [
  { id: 1, name: 'Hotel Yak & Yeti', price: 120, address: 'Durbar Marg, Kathmandu', recommended: true, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Hotel Shanker', price: 90, address: 'Lazimpat, Kathmandu', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Hotel Mulberry', price: 110, address: 'Jyatha, Thamel, Kathmandu', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Hotel Himalaya', price: 80, address: 'Kumaripati, Lalitpur', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Hotel Moonlight', price: 70, address: 'Paknajol, Thamel, Kathmandu', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80' }
];

const dummyKathmanduActivities = [
  { id: 1, name: 'Swayambhu', price: 10 },
  { id: 2, name: 'Pashupatinath', price: 15 },
  { id: 3, name: 'Bhaktapur Durbar Square', price: 20 },
  { id: 4, name: 'Basantapur Durbar Square', price: 12 }
];

const dummyPokharaActivities = [
  { id: 1, name: 'Paragliding', price: 60 },
  { id: 2, name: 'Sarangkot', price: 8 },
  { id: 3, name: 'Fewa Taal', price: 5 },
  { id: 4, name: 'Bat Cave', price: 7 }
];

const dummyPokharaHotels = [
  { id: 1, name: 'Temple Tree Resort', price: 100, recommended: true },
  { id: 2, name: 'Hotel Barahi', price: 80 },
  { id: 3, name: 'Fish Tail Lodge', price: 120 }
];

const dummyPokharaTravel = [
  { id: 1, type: 'Flight', name: 'Buddha Air', price: 45, recommended: true },
  { id: 2, type: 'Flight', name: 'Yeti Airlines', price: 40, recommended: false },
  { id: 3, type: 'Bus', name: 'Tourist Bus', price: 15, recommended: true },
  { id: 4, type: 'Bus', name: 'Local Bus', price: 8, recommended: false }
];

export default function SecondPage({ onBack }) {
  const [selectedFlight, setSelectedFlight] = useState(dummyFlights.reduce((min, f) => f.price < min.price ? f : min, dummyFlights[0]));
  const [hotels, setHotels] = useState(dummyHotels);
  const [selectedHotel, setSelectedHotel] = useState(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
  const [selectedKathmanduActivityIds, setSelectedKathmanduActivityIds] = useState([1, 2, 3, 4]);
  const [selectedPokharaActivityIds, setSelectedPokharaActivityIds] = useState([1, 2, 3, 4]);
  const [showPokhara, setShowPokhara] = useState(true);
  const [pokharaTravelMode, setPokharaTravelMode] = useState('Flight');
  
  const travelOptions = dummyPokharaTravel.filter(t => t.type === pokharaTravelMode);
  const [selectedPokharaTravel, setSelectedPokharaTravel] = useState(travelOptions.find(t => t.recommended) || travelOptions[0]);
  const [selectedPokharaHotel, setSelectedPokharaHotel] = useState({ id: 1, name: 'Temple Tree Resort', price: 100, recommended: true });

  useEffect(() => {
    async function fetchHotelsWithImages() {
      setHotels(dummyHotels);
      setSelectedHotel(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
    }
    fetchHotelsWithImages();
  }, []);

  useEffect(() => {
    const newTravelOptions = dummyPokharaTravel.filter(t => t.type === pokharaTravelMode);
    setSelectedPokharaTravel(newTravelOptions.find(t => t.recommended) || newTravelOptions[0]);
  }, [pokharaTravelMode]);

  const handleToggleKathmanduActivity = (id) => {
    setSelectedKathmanduActivityIds(ids => ids.includes(id) ? ids.filter(aid => aid !== id) : [...ids, id]);
  };

  const handleTogglePokharaActivity = (id) => {
    setSelectedPokharaActivityIds(ids => ids.includes(id) ? ids.filter(aid => aid !== id) : [...ids, id]);
    if (selectedPokharaActivityIds.length === 1 && selectedPokharaActivityIds[0] === id) setShowPokhara(false);
    else if (!selectedPokharaActivityIds.includes(id)) setShowPokhara(true);
  };

  const handlePokharaTravelChange = (id) => {
    if (selectedPokharaActivityIds.length > 0 && id === null) return;
    setSelectedPokharaTravel(dummyPokharaTravel.find(t => t.id === id));
  };

  const receiptItems = [
    { type: 'Flight', desc: `NYC → KTM (${selectedFlight.airline})`, price: selectedFlight.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'Hotel', desc: `Kathmandu: ${selectedHotel.name}`, price: selectedHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-600" /> },
    ...dummyKathmanduActivities.filter(a => selectedKathmanduActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-600" /> }))
  ];

  if (showPokhara && selectedPokharaActivityIds.length > 0) {
    receiptItems.push(
      { type: 'Travel', desc: `KTM → PKR (${selectedPokharaTravel.name})`, price: selectedPokharaTravel.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
      { type: 'Hotel', desc: `Pokhara: ${selectedPokharaHotel.name}`, price: selectedPokharaHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-600" /> },
      ...dummyPokharaActivities.filter(a => selectedPokharaActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <MapPinIcon className="w-5 h-5 text-cyan-600" /> })),
      { type: 'Travel', desc: `PKR → KTM (${selectedPokharaTravel.name})`, price: selectedPokharaTravel.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> }
    );
  }

  const totalPrice = receiptItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <WebFonts />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
        {/* Enhanced Navigation */}
        <nav className="sticky top-0 z-50 glass-effect shadow-xl border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              yatra
            </span>
            <div className="text-sm text-gray-600 font-medium">
              Plan your perfect journey
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-display font-bold text-gray-900 mb-4">
              Customize Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Dream Trip</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailor every aspect of your Nepal adventure with our premium travel packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Travel Section */}
            <div className="space-y-8">
              {/* Flight to Kathmandu */}
              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <ArrowRightIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">To Kathmandu</h2>
                </div>
                <AirlineLogo airlineName={selectedFlight.airline} className="mb-6" />
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 font-medium">New York City → Kathmandu</p>
                  <p className="text-sm text-gray-500">
                    {selectedFlight.layovers.length ? `via ${selectedFlight.layovers.map(code => ({ DOH: 'Doha', DEL: 'Delhi', DXB: 'Dubai' }[code] || code)).join(', ')}` : 'Non-stop'} • {selectedFlight.duration}
                  </p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    ${selectedFlight.price}
                  </div>
                </div>
                <select 
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 font-medium" 
                  value={selectedFlight.id} 
                  onChange={e => { const f = dummyFlights.find(f => f.id === Number(e.target.value)); setSelectedFlight(f); }}
                >
                  {dummyFlights.map(flight => (
                    <option key={flight.id} value={flight.id}>{flight.airline} - ${flight.price}</option>
                  ))}
                </select>
              </div>

              {/* Enhanced Travel Mode Selectors */}
              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <ArrowRightIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Kathmandu → Pokhara</h2>
                </div>
                <TravelModeSelector
                  mode={pokharaTravelMode}
                  onChange={setPokharaTravelMode}
                  selectedTravel={selectedPokharaTravel}
                  options={travelOptions}
                  onTravelChange={handlePokharaTravelChange}
                />
              </div>

              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <ArrowRightIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pokhara → Kathmandu</h2>
                </div>
                <TravelModeSelector
                  mode={pokharaTravelMode}
                  onChange={setPokharaTravelMode}
                  selectedTravel={selectedPokharaTravel}
                  options={travelOptions}
                  onTravelChange={handlePokharaTravelChange}
                />
              </div>
            </div>

            {/* Kathmandu Section */}
            <div className="space-y-8">
              {/* Kathmandu Hotel */}
              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <BuildingOffice2Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Kathmandu Hotel</h2>
                </div>
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{selectedHotel.name}</h3>
                    {selectedHotel.recommended && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        ⭐ Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{selectedHotel.address}</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    ${selectedHotel.price}
                  </div>
                </div>
                <select 
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:border-green-300 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 font-medium" 
                  value={selectedHotel.id} 
                  onChange={e => setSelectedHotel(hotels.find(h => h.id === Number(e.target.value)))}
                >
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name} - ${hotel.price}{hotel.recommended ? ' ⭐' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Kathmandu Activities */}
              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <TicketIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Kathmandu Activities</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {dummyKathmanduActivities.map(act => {
                    const selected = selectedKathmanduActivityIds.includes(act.id);
                    return (
                      <button 
                        key={act.id} 
                        onClick={() => handleToggleKathmanduActivity(act.id)} 
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          selected 
                            ? 'border-pink-500 bg-pink-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                          }`}>
                            {selected && <CheckIcon className="w-4 h-4 text-white" />}
                          </div>
                          <span className="font-medium text-gray-800">{act.name}</span>
                        </span>
                        <span className={`font-bold text-lg ${selected ? 'text-cyan-700' : 'text-gray-600'}`}>
                          ${act.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pokhara Section */}
            <div className="space-y-8">
              {/* Pokhara Hotel */}
              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <BuildingOffice2Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pokhara Hotel</h2>
                </div>
                <div className="space-y-4 mb-6">
                  {dummyPokharaHotels.map(hotel => (
                    <div
                      key={hotel.id}
                      onClick={() => setSelectedPokharaHotel(hotel)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        selectedPokharaHotel.id === hotel.id
                          ? 'border-cyan-500 bg-cyan-50 shadow-lg transform scale-105'
                          : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPokharaHotel.id === hotel.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
                          }`}>
                            {selectedPokharaHotel.id === hotel.id && (
                              <CheckIcon className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{hotel.name}</p>
                            {hotel.recommended && (
                              <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                                ⭐ Recommended
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-cyan-700">${hotel.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pokhara Activities */}
              <div className="gradient-border rounded-2xl p-6 premium-shadow hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Pokhara Activities</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {dummyPokharaActivities.map(act => {
                    const selected = selectedPokharaActivityIds.includes(act.id);
                    return (
                      <button 
                        key={act.id} 
                        onClick={() => handleTogglePokharaActivity(act.id)} 
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          selected 
                            ? 'border-cyan-500 bg-cyan-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-cyan-300 hover:bg-cyan-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
                          }`}>
                            {selected && <CheckIcon className="w-4 h-4 text-white" />}
                          </div>
                          <span className="font-medium text-gray-800">{act.name}</span>
                        </span>
                        <span className={`font-bold text-lg ${selected ? 'text-cyan-700' : 'text-gray-600'}`}>
                          ${act.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Receipt Section */}
          <div className="gradient-border rounded-3xl p-8 premium-shadow bg-white">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Trip Summary</h1>
              <p className="text-gray-600">Your personalized Nepal adventure package</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {receiptItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.desc}</p>
                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                    </div>
                  </div>
                ))}
                {/* Taxes and fees */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-bold">%</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Taxes & Fees</p>
                      <p className="text-sm text-gray-500">13% service charge</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-700">${(totalPrice * 0.13).toFixed(2)}</span>
                  </div>
                </div>
                {/* Total */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-6 text-white premium-shadow">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold mb-1">Total Amount</p>
                      <p className="text-blue-100">All inclusive pricing</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-bold">${(totalPrice * 1.13).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 premium-shadow">
                    Book This Trip
                  </button>
                  <button className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}