import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, BuildingOffice2Icon, TicketIcon, MapPinIcon, XMarkIcon, PlusIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import AirlineLogo from './components/AirlineLogo';
import travelApi from './services/travelApi';
import countryCityData from './data/countries-cities.json';
import flightPricingData from './data/flight-pricing.json';

// Simple Bus Icon Component
const BusIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
  </svg>
);

// Proper Airplane Icon Component
const AirplaneIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

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
            <span className="flex items-center gap-2">
              {modeOption === 'Flight' ? (
                <AirplaneIcon className="w-4 h-4" />
              ) : (
                <BusIcon className="w-4 h-4" />
              )}
              {modeOption}
            </span>
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

// Return flight data for popular destinations
const returnFlightData = {
  'New York': [
    { id: 1, airline: 'Delta', price: 920, from: 'KTM', to: 'JFK', layovers: ['DOH'], duration: '19h 45m', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Delta_logo.svg' },
    { id: 2, airline: 'Emirates', price: 985, from: 'KTM', to: 'JFK', layovers: ['DXB'], duration: '21h 30m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Emirates_logo.svg' },
    { id: 3, airline: 'Qatar Airways', price: 910, from: 'KTM', to: 'JFK', layovers: ['DOH'], duration: '20h 15m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Qatar_Airways_Logo.svg' }
  ],
  'Los Angeles': [
    { id: 1, airline: 'United', price: 1050, from: 'KTM', to: 'LAX', layovers: ['DOH', 'ORD'], duration: '24h 30m', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/United_Airlines_Logo.svg' },
    { id: 2, airline: 'Emirates', price: 1120, from: 'KTM', to: 'LAX', layovers: ['DXB'], duration: '23h 45m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Emirates_logo.svg' },
    { id: 3, airline: 'Qatar Airways', price: 1080, from: 'KTM', to: 'LAX', layovers: ['DOH'], duration: '22h 50m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Qatar_Airways_Logo.svg' }
  ],
  'London': [
    { id: 1, airline: 'British Airways', price: 780, from: 'KTM', to: 'LHR', layovers: ['DEL'], duration: '16h 20m', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/British_Airways_logo.svg' },
    { id: 2, airline: 'Qatar Airways', price: 820, from: 'KTM', to: 'LHR', layovers: ['DOH'], duration: '17h 45m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Qatar_Airways_Logo.svg' },
    { id: 3, airline: 'Emirates', price: 850, from: 'KTM', to: 'LHR', layovers: ['DXB'], duration: '18h 10m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Emirates_logo.svg' }
  ],
  'Dubai': [
    { id: 1, airline: 'Emirates', price: 420, from: 'KTM', to: 'DXB', layovers: [], duration: '4h 30m', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Emirates_logo.svg', recommended: true },
    { id: 2, airline: 'flydubai', price: 380, from: 'KTM', to: 'DXB', layovers: [], duration: '4h 45m', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flydubai_logo.svg' },
    { id: 3, airline: 'Air Arabia', price: 350, from: 'KTM', to: 'DXB', layovers: [], duration: '5h 00m', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Air_Arabia_logo.svg' }
  ],
  'Tokyo': [
    { id: 1, airline: 'All Nippon Airways', price: 680, from: 'KTM', to: 'NRT', layovers: ['DEL'], duration: '12h 40m', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/76/All_Nippon_Airways_Logo.svg' },
    { id: 2, airline: 'Japan Airlines', price: 720, from: 'KTM', to: 'NRT', layovers: ['BKK'], duration: '13h 15m', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Japan_Airlines_Logo.svg' },
    { id: 3, airline: 'Thai Airways', price: 650, from: 'KTM', to: 'NRT', layovers: ['BKK'], duration: '11h 50m', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Thai_Airways_Logo.svg', recommended: true }
  ]
};

// Utility function to get flight pricing data for a city
const getFlightPricingForCity = (cityName) => {
  // Search through all countries in flight pricing data
  for (const [country, data] of Object.entries(flightPricingData.routes)) {
    if (data.major_cities && data.major_cities[cityName]) {
      return data.major_cities[cityName];
    }
  }
  return null;
};

// Function to get all cities with flight pricing data
const getCitiesWithFlightData = () => {
  const cities = [];
  for (const [country, data] of Object.entries(flightPricingData.routes)) {
    if (data.major_cities) {
      cities.push(...Object.keys(data.major_cities));
    }
  }
  return cities.sort();
};

// Get available destination cities from flight pricing data
const availableDestinations = getCitiesWithFlightData();

// Enhanced return flight data using pricing data
const getReturnFlightData = (cityName) => {
  const pricingData = getFlightPricingForCity(cityName);
  if (!pricingData || !pricingData.from_kathmandu) {
    return [];
  }
  
  return pricingData.from_kathmandu.map((flight, index) => ({
    id: index + 1,
    airline: flight.airline,
    airline_code: flight.airline_code,
    price: flight.price,
    from: 'KTM',
    to: pricingData.airport_code || cityName.substring(0, 3).toUpperCase(),
    layovers: flight.layovers || [],
    duration: flight.duration,
    recommended: flight.recommended || false,
    logo: `https://via.placeholder.com/100x40/333/fff?text=${flight.airline_code}`
  }));
};

export default function SecondPage({ onBack }) {
  // --- Loading States ---
  const [isLoadingFlights, setIsLoadingFlights] = useState(true);
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // --- State for Travel Section ---
  const [selectedFlight, setSelectedFlight] = useState(dummyFlights.reduce((min, f) => f.price < min.price ? f : min, dummyFlights[0]));
  
  // --- State for Return Flight Section ---
  const [selectedReturnCity, setSelectedReturnCity] = useState(availableDestinations[0] || 'New York');
  const [availableReturnFlights, setAvailableReturnFlights] = useState(() => getReturnFlightData(availableDestinations[0] || 'New York'));
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(() => {
    const flights = getReturnFlightData(availableDestinations[0] || 'New York');
    return flights.find(f => f.recommended) || flights[0];
  });
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // --- State for Kathmandu Section ---
  const [hotels, setHotels] = useState(dummyHotels);
  const [selectedHotel, setSelectedHotel] = useState(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
  const [kathmanduDays, setKathmanduDays] = useState(3);
  const [selectedKathmanduActivityIds, setSelectedKathmanduActivityIds] = useState([1, 2, 3, 4]);

  // --- State for Pokhara Section ---
  const [selectedPokharaHotel, setSelectedPokharaHotel] = useState({ id: 1, name: 'Temple Tree Resort', price: 100, recommended: true });
  const [pokharaDays, setPokharaDays] = useState(2);
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

  // Initialize API services and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🚀 Initializing travel booking system...');
        
        // Initialize API services
        await travelApi.initializeAPIServices();
        
        // Load flights data from Amadeus API
        setIsLoadingFlights(true);
        const flightsResponse = await travelApi.searchFlights('JFK', 'KTM', '2025-02-15', '2025-02-25');
        console.log('✈️ Flights loaded from API:', flightsResponse.data.length, 'options');
        setIsLoadingFlights(false);

        // Load hotels data from Booking.com API
        setIsLoadingHotels(true);
        const hotelsResponse = await travelApi.searchHotels('kathmandu', '2025-02-15', '2025-02-18');
        setHotels(hotelsResponse.data);
        setSelectedHotel(hotelsResponse.data.find(h => h.recommended) || hotelsResponse.data[0]);
        console.log('🏨 Hotels loaded from API:', hotelsResponse.data.length, 'options');
        setIsLoadingHotels(false);

        // Load activities from Google Places API
        setIsLoadingActivities(true);
        const activitiesResponse = await travelApi.searchActivities('kathmandu');
        console.log('🎯 Activities loaded from Google Places API:', activitiesResponse.data.length, 'options');
        setIsLoadingActivities(false);

        console.log('✅ All travel data successfully loaded from APIs');
      } catch (error) {
        console.error('❌ Failed to initialize travel data:', error);
        // Fallback to dummy data
        setHotels(dummyHotels);
        setSelectedHotel(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
        setIsLoadingFlights(false);
        setIsLoadingHotels(false);
        setIsLoadingActivities(false);
      }
    };

    initializeData();
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
  
  // --- Return Flight Handlers ---
  const handleReturnCityChange = (city) => {
    setSelectedReturnCity(city);
    const flights = getReturnFlightData(city);
    setAvailableReturnFlights(flights);
    setSelectedReturnFlight(flights.find(f => f.recommended) || flights[0]);
    setIsCityDropdownOpen(false);
    setCitySearchTerm('');
  };
  
  const handleReturnFlightChange = (flightId) => {
    setSelectedReturnFlight(availableReturnFlights.find(f => f.id === flightId));
  };

  // Filter cities based on search term
  const filteredDestinations = availableDestinations.filter(city =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  // --- Receipt Items ---
  const receiptItems = [
    { type: 'Flight', desc: `NYC → KTM (${selectedFlight.airline})`, price: selectedFlight.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'Hotel', desc: `Kathmandu: ${selectedHotel.name} (${kathmanduDays} nights)`, price: selectedHotel.price * kathmanduDays, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-600" /> },
    ...dummyKathmanduActivities.filter(a => selectedKathmanduActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-600" /> })),
    { type: 'Travel', desc: `KTM → PKR (${selectedPokharaTravelKtmToPkr.name})`, price: selectedPokharaTravelKtmToPkr.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
    { type: 'Hotel', desc: `Pokhara: ${selectedPokharaHotel.name} (${pokharaDays} nights)`, price: selectedPokharaHotel.price * pokharaDays, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-600" /> },
    ...dummyPokharaActivities.filter(a => selectedPokharaActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-cyan-600" /> })),
    { type: 'Travel', desc: `PKR → KTM (${selectedPokharaTravelPkrToKtm.name})`, price: selectedPokharaTravelPkrToKtm.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-600" /> },
    ...(selectedReturnFlight ? [{ type: 'Return Flight', desc: `KTM → ${selectedReturnCity} (${selectedReturnFlight.airline})`, price: selectedReturnFlight.price, icon: <ArrowRightIcon className="w-5 h-5 text-purple-600" /> }] : [])
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
                <span className="text-xl font-display font-bold text-gray-900">Yaan</span>
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
              <div className="bg-gray-200/60 rounded-xl p-6 border border-gray-300/50">
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
                <div className="relative">
                  <select 
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 transition-colors appearance-none cursor-pointer" 
                    value={selectedFlight.id} 
                    onChange={e => { const f = dummyFlights.find(f => f.id === Number(e.target.value)); setSelectedFlight(f); }}
                  >
                    {dummyFlights.map(flight => (
                      <option key={flight.id} value={flight.id} className="py-2">{flight.airline} - ${flight.price}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* Kathmandu to Pokhara */}
              <div className="bg-gray-200/60 rounded-xl p-6 border border-gray-300/50">
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
              <div className="bg-gray-200/60 rounded-xl p-6 border border-gray-300/50">
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
                <div className="bg-gray-200/40 rounded-xl p-6 border border-gray-300/40">
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
                    
                    {/* Days Selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Nights:</label>
                      <div className="relative">
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer pr-8" 
                          value={kathmanduDays} 
                          onChange={e => setKathmanduDays(Number(e.target.value))}
                        >
                          {[1,2,3,4,5,6,7].map(days => (
                            <option key={days} value={days}>{days} night{days > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold text-green-600">
                      ${selectedHotel.price} <span className="text-sm text-gray-500">per night</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      Total: ${selectedHotel.price * kathmanduDays} for {kathmanduDays} night{kathmanduDays > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full p-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:border-gray-400 transition-colors appearance-none cursor-pointer" 
                      value={selectedHotel.id} 
                      onChange={e => setSelectedHotel(hotels.find(h => h.id === Number(e.target.value)))}
                    >
                      {hotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id} className="py-2">{hotel.name} - ${hotel.price}{hotel.recommended ? ' ⭐' : ''}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
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
                            : 'border-gray-200 bg-gray-200/30 hover:border-gray-300 hover:bg-gray-200/50'
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
                <div className="bg-gray-200/40 rounded-xl p-6 border border-gray-300/40">
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
                    
                    {/* Days Selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Nights:</label>
                      <div className="relative">
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none cursor-pointer pr-8" 
                          value={pokharaDays} 
                          onChange={e => setPokharaDays(Number(e.target.value))}
                        >
                          {[1,2,3,4,5,6,7].map(days => (
                            <option key={days} value={days}>{days} night{days > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold text-cyan-600">
                      ${selectedPokharaHotel.price} <span className="text-sm text-gray-500">per night</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                      Total: ${selectedPokharaHotel.price * pokharaDays} for {pokharaDays} night{pokharaDays > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full p-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm hover:border-gray-400 transition-colors appearance-none cursor-pointer" 
                      value={selectedPokharaHotel.id} 
                      onChange={e => setSelectedPokharaHotel(dummyPokharaHotels.find(h => h.id === Number(e.target.value)))}
                    >
                      {dummyPokharaHotels.map(hotel => (
                        <option key={hotel.id} value={hotel.id} className="py-2">{hotel.name} - ${hotel.price}{hotel.recommended ? ' ⭐' : ''}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
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
                            : 'border-gray-200 bg-gray-200/30 hover:border-gray-300 hover:bg-gray-200/50'
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

          {/* Return Flight Selection & Trip Summary */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Complete Your Journey</h2>
              <p className="text-gray-600">Select your return destination and review your trip</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Return Flight Selector - Left Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <ArrowRightIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Return Flight</h3>
                </div>
                
                <div className="bg-gray-200/40 rounded-xl p-6 border border-gray-300/40">
                  
                  {/* City Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Destination City</label>
                    <div className="relative">
                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={selectedReturnCity || "Search for a city..."}
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          onFocus={() => setIsCityDropdownOpen(true)}
                          className="w-full p-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:border-gray-400 transition-colors cursor-pointer"
                        />
                        <button
                          onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        >
                          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      {/* Dropdown Options */}
                      {isCityDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredDestinations.length > 0 ? (
                            filteredDestinations.map(city => (
                              <button
                                key={city}
                                onClick={() => handleReturnCityChange(city)}
                                className={`w-full text-left px-4 py-3 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-100 last:border-b-0 ${
                                  selectedReturnCity === city ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                                }`}
                              >
                                {city}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No cities found matching "{citySearchTerm}"
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Click outside to close */}
                      {isCityDropdownOpen && (
                        <div
                          className="fixed inset-0 z-5"
                          onClick={() => setIsCityDropdownOpen(false)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Flight Details */}
                  {selectedReturnFlight && (
                    <>
                      <AirlineLogo airlineName={selectedReturnFlight.airline} airlineCode={selectedReturnFlight.airline_code} className="mb-6 h-20 w-full object-contain" />
                      <div className="space-y-3 mb-6">
                        <p className="text-gray-700 font-medium">Kathmandu → {selectedReturnCity}</p>
                        <p className="text-sm text-gray-600">
                          {selectedReturnFlight.layovers.length ? `via ${selectedReturnFlight.layovers.map(code => ({ DOH: 'Doha', DEL: 'Delhi', DXB: 'Dubai', ORD: 'Chicago', BKK: 'Bangkok' }[code] || code)).join(', ')}` : 'Non-stop'} • {selectedReturnFlight.duration}
                        </p>
                        <div className="text-3xl font-bold text-purple-600">
                          ${selectedReturnFlight.price}
                        </div>
                      </div>
                      
                      {/* Flight Options */}
                      <div className="relative">
                        <select 
                          className="w-full p-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:border-gray-400 transition-colors appearance-none cursor-pointer" 
                          value={selectedReturnFlight.id} 
                          onChange={e => handleReturnFlightChange(Number(e.target.value))}
                        >
                          {availableReturnFlights.map(flight => (
                            <option key={flight.id} value={flight.id} className="py-2">{flight.airline} - ${flight.price}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Trip Summary - Right Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <TicketIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Trip Summary</h3>
                </div>
                
                <div className="bg-gray-200/40 rounded-xl p-6 border border-gray-300/40">
                  {/* Scrollable Items Container */}
                  <div className="max-h-64 overflow-y-scroll space-y-2 mb-4 pr-2 scrollbar-custom scrollbar-always">
                    {receiptItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.desc}</p>
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary Section */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-bold text-sm">%</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 text-sm">Taxes & Fees</p>
                          <p className="text-xs text-gray-500">13% service charge</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-700">${(totalPrice * 0.13).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      <div>
                        <p className="font-bold mb-1">Total Amount</p>
                        <p className="text-blue-100 text-xs">All inclusive pricing</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">${(totalPrice * 1.13).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Book Now Button */}
          <section className="text-center pb-8">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Book Now - ${(totalPrice * 1.13).toFixed(2)}
            </button>
            <p className="text-sm text-gray-500 mt-3">Secure booking • Instant confirmation • 24/7 support</p>
          </section>
        </div>
      </div>
    </>
  );
}