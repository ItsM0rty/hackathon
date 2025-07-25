import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, BuildingOffice2Icon, TicketIcon, MapPinIcon, XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import AirlineLogo from './components/AirlineLogo';

// Web fonts - adding premium typography
const WebFonts = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Playfair Display', serif; }
      .font-sans { font-family: 'Inter', sans-serif; }
    `}
  </style>
);

// Enhanced Travel Mode Selector Component with animations
const TravelModeSelector = ({ mode, onChange, selectedTravel, options, onTravelChange, title }) => {
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
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedTravel.id === travel.id ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
                }`}></div>
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
  // --- State for Travel Section ---
  const [selectedFlight, setSelectedFlight] = useState(dummyFlights.reduce((min, f) => f.price < min.price ? f : min, dummyFlights[0]));

  // --- State for Kathmandu Section ---
  const [hotels, setHotels] = useState(dummyHotels);
  const [selectedHotel, setSelectedHotel] = useState(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
  const [selectedKathmanduActivityIds, setSelectedKathmanduActivityIds] = useState([1, 2, 3, 4]);

  // --- State for Pokhara Section ---
  const [selectedPokharaHotel, setSelectedPokharaHotel] = useState({ id: 1, name: 'Temple Tree Resort', price: 100, recommended: true });
  const [selectedPokharaActivityIds, setSelectedPokharaActivityIds] = useState([1, 2, 3, 4]);

  // --- Split Pokhara Travel into two directions ---
  const [pokharaTravelModeKtmToPkr, setPokharaTravelModeKtmToPkr] = useState('Flight');
  const [pokharaTravelModePkrToKtm, setPokharaTravelModePkrToKtm] = useState('Flight');
  const travelOptionsKtmToPkr = dummyPokharaTravel.filter(t => t.type === pokharaTravelModeKtmToPkr);
  const travelOptionsPkrToKtm = dummyPokharaTravel.filter(t => t.type === pokharaTravelModePkrToKtm);
  const [selectedPokharaTravelKtmToPkr, setSelectedPokharaTravelKtmToPkr] = useState(travelOptionsKtmToPkr.find(t => t.recommended) || travelOptionsKtmToPkr[0]);
  const [selectedPokharaTravelPkrToKtm, setSelectedPokharaTravelPkrToKtm] = useState(travelOptionsPkrToKtm.find(t => t.recommended) || travelOptionsPkrToKtm[0]);

  useEffect(() => {
    setSelectedPokharaTravelKtmToPkr(travelOptionsKtmToPkr.find(t => t.recommended) || travelOptionsKtmToPkr[0]);
  }, [pokharaTravelModeKtmToPkr]);
  useEffect(() => {
    setSelectedPokharaTravelPkrToKtm(travelOptionsPkrToKtm.find(t => t.recommended) || travelOptionsPkrToKtm[0]);
  }, [pokharaTravelModePkrToKtm]);

  useEffect(() => {
    setHotels(dummyHotels);
    setSelectedHotel(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
  }, []);

  // --- Handlers ---
  const handleToggleKathmanduActivity = (id) => {
    setSelectedKathmanduActivityIds(ids => ids.includes(id) ? ids.filter(aid => aid !== id) : [...ids, id]);
  };
  const handleTogglePokharaActivity = (id) => {
    setSelectedPokharaActivityIds(ids => ids.includes(id) ? ids.filter(aid => aid !== id) : [...ids, id]);
  };
  const handlePokharaTravelKtmToPkrChange = (id) => {
    setSelectedPokharaTravelKtmToPkr(dummyPokharaTravel.find(t => t.id === id));
  };
  const handlePokharaTravelPkrToKtmChange = (id) => {
    setSelectedPokharaTravelPkrToKtm(dummyPokharaTravel.find(t => t.id === id));
  };

  // --- Receipt Items ---
  const receiptItems = [
    { type: 'Flight', desc: `NYC → KTM (${selectedFlight.airline})`, price: selectedFlight.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'Hotel', desc: `Kathmandu: ${selectedHotel.name}`, price: selectedHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-600" /> },
    ...dummyKathmanduActivities.filter(a => selectedKathmanduActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-600" /> })),
    { type: 'Travel', desc: `KTM → PKR (${selectedPokharaTravelKtmToPkr.name})`, price: selectedPokharaTravelKtmToPkr.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'Hotel', desc: `Pokhara: ${selectedPokharaHotel.name}`, price: selectedPokharaHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-600" /> },
    ...dummyPokharaActivities.filter(a => selectedPokharaActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <MapPinIcon className="w-5 h-5 text-cyan-600" /> })),
    { type: 'Travel', desc: `PKR → KTM (${selectedPokharaTravelPkrToKtm.name})`, price: selectedPokharaTravelPkrToKtm.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> }
  ];
  const totalPrice = receiptItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <WebFonts />
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <span className="text-xl font-display font-bold text-gray-900">Yatra</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Destinations</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Packages</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Contact</a>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900 font-medium">Sign In</button>
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Travel Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ArrowRightIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Travel</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Flight to Kathmandu */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">NYC → Kathmandu</h3>
                <AirlineLogo airlineName={selectedFlight.airline} airlineCode={selectedFlight.code} className="mb-6 h-20 w-full object-contain" />
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 font-medium">New York City → Kathmandu</p>
                  <p className="text-sm text-gray-600">
                    {selectedFlight.layovers.length ? `via ${selectedFlight.layovers.map(code => ({ DOH: 'Doha', DEL: 'Delhi', DXB: 'Dubai' }[code] || code)).join(', ')}` : 'Non-stop'} • {selectedFlight.duration}
                  </p>
                  <div className="text-3xl font-bold text-blue-600">
                    ${selectedFlight.price}
                  </div>
                </div>
                <select 
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={selectedFlight.id} 
                  onChange={e => { const f = dummyFlights.find(f => f.id === Number(e.target.value)); setSelectedFlight(f); }}
                >
                  {dummyFlights.map(flight => (
                    <option key={flight.id} value={flight.id}>{flight.airline} - ${flight.price}</option>
                  ))}
                </select>
              </div>
              {/* Kathmandu to Pokhara */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">KTM → Pokhara</h3>
                <TravelModeSelector
                  mode={pokharaTravelModeKtmToPkr}
                  onChange={setPokharaTravelModeKtmToPkr}
                  selectedTravel={selectedPokharaTravelKtmToPkr}
                  options={travelOptionsKtmToPkr}
                  onTravelChange={handlePokharaTravelKtmToPkrChange}
                  title="Travel Mode"
                />
              </div>
              {/* Pokhara to Kathmandu */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Pokhara → KTM</h3>
                <TravelModeSelector
                  mode={pokharaTravelModePkrToKtm}
                  onChange={setPokharaTravelModePkrToKtm}
                  selectedTravel={selectedPokharaTravelPkrToKtm}
                  options={travelOptionsPkrToKtm}
                  onTravelChange={handlePokharaTravelPkrToKtmChange}
                  title="Travel Mode"
                />
              </div>
            </div>
          </section>

          {/* Kathmandu Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <BuildingOffice2Icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Kathmandu</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Kathmandu Hotel */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Hotel</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-48 object-cover" />
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-gray-900">{selectedHotel.name}</h4>
                      {selectedHotel.recommended && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{selectedHotel.address}</p>
                    <div className="text-3xl font-bold text-green-600">
                      ${selectedHotel.price}
                    </div>
                  </div>
                  <select 
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    value={selectedHotel.id} 
                    onChange={e => setSelectedHotel(hotels.find(h => h.id === Number(e.target.value)))}
                  >
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name} - ${hotel.price}{hotel.recommended ? ' ⭐' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Kathmandu Activities */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Activities</h3>
                <div className="space-y-3">
                  {dummyKathmanduActivities.map(act => {
                    const selected = selectedKathmanduActivityIds.includes(act.id);
                    return (
                      <button 
                        key={act.id} 
                        onClick={() => handleToggleKathmanduActivity(act.id)} 
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          selected 
                            ? 'border-pink-200 bg-pink-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                          }`}>
                            {selected && <CheckIcon className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium text-gray-800">{act.name}</span>
                        </span>
                        <span className={`font-bold text-lg ${selected ? 'text-pink-600' : 'text-gray-600'}`}>
                          ${act.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Pokhara Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Pokhara</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pokhara Hotel (dropdown, image, address, price, like Kathmandu) */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Hotel</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img src={selectedPokharaHotel.image} alt={selectedPokharaHotel.name} className="w-full h-48 object-cover" />
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-gray-900">{selectedPokharaHotel.name}</h4>
                      {selectedPokharaHotel.recommended && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{selectedPokharaHotel.address}</p>
                    <div className="text-3xl font-bold text-cyan-600">
                      ${selectedPokharaHotel.price}
                    </div>
                  </div>
                  <select 
                    className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    value={selectedPokharaHotel.id} 
                    onChange={e => setSelectedPokharaHotel(dummyPokharaHotels.find(h => h.id === Number(e.target.value)))}
                  >
                    {dummyPokharaHotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name} - ${hotel.price}{hotel.recommended ? ' ⭐' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Pokhara Activities (same as Kathmandu Activities) */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Activities</h3>
                <div className="space-y-3">
                  {dummyPokharaActivities.map(act => {
                    const selected = selectedPokharaActivityIds.includes(act.id);
                    return (
                      <button 
                        key={act.id} 
                        onClick={() => handleTogglePokharaActivity(act.id)} 
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                          selected 
                            ? 'border-cyan-200 bg-cyan-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'
                          }`}>
                            {selected && <CheckIcon className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium text-gray-800">{act.name}</span>
                        </span>
                        <span className={`font-bold text-lg ${selected ? 'text-cyan-600' : 'text-gray-600'}`}>
                          ${act.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Trip Summary */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Trip Summary</h2>
              <p className="text-gray-600">Your personalized Nepal adventure package</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {receiptItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.desc}</p>
                      <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">${item.price}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Taxes & Fees</p>
                    <p className="text-sm text-gray-600">13% service charge</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-700">${(totalPrice * 0.13).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-600 text-white">
                <div>
                  <p className="text-lg font-bold mb-1">Total Amount</p>
                  <p className="text-blue-100 text-xs">All inclusive pricing</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">${(totalPrice * 1.13).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}