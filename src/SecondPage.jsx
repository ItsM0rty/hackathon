/**
 * SecondPage expects the following props/data to be forwarded from page 1:
 * - originCity: { code, name, iata }
 * - selectedKathmanduActivities: [ { name, price } ]
 * - selectedPokharaActivities: [ { name, price } ]
 * - (optionally) selectedHotel, selectedFlight, selectedPokharaHotel, selectedPokharaTravel
 * For now, all data is dummy and activities are pre-selected. Update integration as needed.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightIcon, BuildingOffice2Icon, TicketIcon, MapPinIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import dummyCities from './data/dummyCities.json';

// Dummy data with images
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
  { id: 2, type: 'Bus', name: 'Tourist Bus', price: 15 }
];

const defaultOriginCity = dummyCities[0];

export default function SecondPage({ onBack }) {
  // State for selections
  const [selectedFlight, setSelectedFlight] = useState(dummyFlights.reduce((min, f) => f.price < min.price ? f : min, dummyFlights[0]));
  const [hotels, setHotels] = useState(dummyHotels);
  const [selectedHotel, setSelectedHotel] = useState(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
  const [selectedKathmanduActivityIds, setSelectedKathmanduActivityIds] = useState([1,2,3,4]);
  const [selectedPokharaActivityIds, setSelectedPokharaActivityIds] = useState([1,2,3,4]);
  const [showPokhara, setShowPokhara] = useState(true);
  const [selectedPokharaTravel, setSelectedPokharaTravel] = useState({ id: 1, type: 'Flight', name: 'Buddha Air', price: 45, recommended: true });
  const [selectedPokharaHotel, setSelectedPokharaHotel] = useState({ id: 1, name: 'Temple Tree Resort', price: 100, recommended: true });
  const [showTravelPopup, setShowTravelPopup] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [nycHotels, setNycHotels] = useState([]);
  const [loadingNycHotels, setLoadingNycHotels] = useState(false);

  // Fetch real hotels with images from Travel Advisor API using the exact axios pattern and API key
  useEffect(() => {
    async function fetchHotelsWithImages() {
      setLoadingHotels(true);
      try {
        const options = {
          method: 'GET',
          url: 'https://travel-advisor.p.rapidapi.com/hotels/list',
          params: {
            location_id: '60763', // New York City
            adults: '1',
            rooms: '1',
            nights: '1',
            offset: '0',
            currency: 'USD',
            order: 'asc',
            limit: '10',
            lang: 'en_US'
          },
          headers: {
            'x-rapidapi-key': '1f71848eadmsha928b4893da388bp1c0256jsna732816475f9',
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
          }
        };
        const response = await axios.request(options);
        const hotelsWithImages = response.data.data
          .filter(hotel => hotel.photo?.images?.original?.url)
          .map((hotel, idx) => ({
            id: idx + 1,
            name: hotel.name,
            price: hotel.price ? Number(hotel.price) : 100 + idx * 10,
            address: hotel.address || hotel.location_string || 'Kathmandu',
            image: hotel.photo.images.original.url,
            recommended: idx === 0
          }));
        if (hotelsWithImages.length > 0) {
          setHotels(hotelsWithImages);
          setSelectedHotel(hotelsWithImages.find(h => h.recommended) || hotelsWithImages[0]);
        } else {
          setHotels(dummyHotels);
          setSelectedHotel(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
        }
      } catch (e) {
        setHotels(dummyHotels);
        setSelectedHotel(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
      } finally {
        setLoadingHotels(false);
      }
    }
    fetchHotelsWithImages();
  }, []);

  // Fetch Paris hotels as a separate example (was NYC)
  useEffect(() => {
    async function fetchParisHotels() {
      setLoadingNycHotels(true);
      try {
        const options = {
          method: 'GET',
          url: 'https://travel-advisor.p.rapidapi.com/hotels/list',
          params: {
            location_id: '187147', // Paris
            adults: '1',
            rooms: '1',
            nights: '1',
            currency: 'USD',
            lang: 'en_US'
            // Optionally add checkin/checkout if needed
            // checkin: '2024-07-01',
            // checkout: '2024-07-02'
          },
          headers: {
            'x-rapidapi-key': '1f71848eadmsha928b4893da388bp1c0256jsna732816475f9',
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
          }
        };
        const response = await axios.request(options);
        const hotelsWithImages = response.data.data
          .filter(hotel => hotel.photo?.images?.original?.url)
          .map((hotel, idx) => ({
            id: idx + 1,
            name: hotel.name,
            price: hotel.price ? Number(hotel.price) : 100 + idx * 10,
            address: hotel.address || hotel.location_string || 'Paris',
            image: hotel.photo.images.original.url
          }));
        setNycHotels(hotelsWithImages);
      } catch (e) {
        setNycHotels([]);
      } finally {
        setLoadingNycHotels(false);
      }
    }
    fetchParisHotels();
  }, []);

  // Activity selection handlers
  const handleToggleKathmanduActivity = (id) => {
    setSelectedKathmanduActivityIds(ids => ids.includes(id) ? ids.filter(aid => aid !== id) : [...ids, id]);
  };
  const handleTogglePokharaActivity = (id) => {
    setSelectedPokharaActivityIds(ids => ids.includes(id) ? ids.filter(aid => aid !== id) : [...ids, id]);
    if (selectedPokharaActivityIds.length === 1 && selectedPokharaActivityIds[0] === id) setShowPokhara(false);
    else if (!selectedPokharaActivityIds.includes(id)) setShowPokhara(true);
  };

  // Prevent removing Pokhara travel if activities exist
  const handlePokharaTravelChange = (id) => {
    if (selectedPokharaActivityIds.length > 0 && id === null) {
      setShowTravelPopup(true);
      return;
    }
    setSelectedPokharaTravel(dummyPokharaTravel.find(t => t.id === id));
  };

  // Receipt calculation
  const receiptItems = [
    { type: 'Flight', desc: `NYC → KTM (${selectedFlight.airline})`, price: selectedFlight.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-500 inline-block mr-1" /> },
    { type: 'Hotel', desc: `Kathmandu: ${selectedHotel.name}`, price: selectedHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-500 inline-block mr-1" /> },
    ...dummyKathmanduActivities.filter(a => selectedKathmanduActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-500 inline-block mr-1" /> })),
  ];
  if (showPokhara && selectedPokharaActivityIds.length > 0) {
    receiptItems.push(
      { type: 'Travel', desc: `KTM → PKR (${selectedPokharaTravel.name})`, price: selectedPokharaTravel.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-500 inline-block mr-1" /> },
      { type: 'Hotel', desc: `Pokhara: ${selectedPokharaHotel.name}`, price: selectedPokharaHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-500 inline-block mr-1" /> },
      ...dummyPokharaActivities.filter(a => selectedPokharaActivityIds.includes(a.id)).map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-500 inline-block mr-1" /> })),
      { type: 'Travel', desc: `PKR → KTM (${selectedPokharaTravel.name})`, price: selectedPokharaTravel.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-500 inline-block mr-1" /> }
    );
  }
  const totalPrice = receiptItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Tailwind test element */}
      <div className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-center py-2 font-bold text-lg rounded shadow mb-4">
        Tailwind is working if this bar is colorful!
      </div>
      {/* Minimal popup for travel removal error */}
      {showTravelPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
            <p className="mb-4 text-gray-800">You have activities in Pokhara. Remove them before removing travel.</p>
            <button className="btn btn-primary w-full" onClick={() => setShowTravelPopup(false)}>OK</button>
          </div>
        </div>
      )}
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-10 py-8 flex-1">
        {/* Flights Section */}
        <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-blue-100 mb-2">
          <h1 className="text-2xl font-bold mb-4 text-blue-900 tracking-tight">Flight to Kathmandu</h1>
          <select className="select select-bordered w-full mb-4" value={selectedFlight.id} onChange={e => setSelectedFlight(dummyFlights.find(f => f.id === Number(e.target.value)))}>
            {dummyFlights.map(flight => (
              <option key={flight.id} value={flight.id}>{flight.airline} (${flight.price}) - {flight.layovers.length ? `Layover: ${flight.layovers.join(', ')}` : 'Non-stop'} - {flight.duration}</option>
            ))}
          </select>
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 shadow-inner">
            <img src={selectedFlight.logo} alt={selectedFlight.airline + ' logo'} className="w-12 h-12 object-contain rounded bg-white border border-blue-200 shadow" />
            <div className="flex-1">
              <div className="font-semibold text-blue-800 text-lg">{selectedFlight.airline}</div>
              <div className="text-sm text-gray-500">NYC → KTM {selectedFlight.layovers.length ? `via ${selectedFlight.layovers.join(', ')}` : 'Non-stop'} ({selectedFlight.duration})</div>
            </div>
            <div className="text-xl font-bold text-blue-700">${selectedFlight.price}</div>
          </div>
        </section>
        {/* Hotel Section */}
        <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-green-100 mb-2">
          <h1 className="text-2xl font-bold mb-4 text-green-900 tracking-tight">Hotel in Kathmandu</h1>
          {loadingHotels ? (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-lg text-green-600"></span>
            </div>
          ) : (
            <>
              <select className="select select-bordered w-full mb-4" value={selectedHotel.id} onChange={e => setSelectedHotel(hotels.find(h => h.id === Number(e.target.value)))}>
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name} (${hotel.price}){hotel.recommended ? ' - Recommended' : ''}</option>
                ))}
              </select>
              <div className="flex items-center gap-4 bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 shadow-inner">
                <img src={selectedHotel.image} alt={selectedHotel.name + ' image'} className="w-16 h-16 object-cover rounded-lg border border-green-200 shadow" />
                <div className="flex-1">
                  <div className="font-semibold text-green-800 text-lg">{selectedHotel.name} {selectedHotel.recommended && <span className="badge badge-success ml-2">Recommended</span>}</div>
                  <div className="text-sm text-gray-500">{selectedHotel.address}</div>
                </div>
                <div className="text-xl font-bold text-green-700">${selectedHotel.price}</div>
              </div>
            </>
          )}
        </section>
        {/* Paris Hotels Example Section */}
        <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-blue-300 mb-2">
          <h1 className="text-2xl font-bold mb-4 text-blue-900 tracking-tight">Example: Hotels in Paris</h1>
          {loadingNycHotels ? (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
          ) : nycHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {nycHotels.map(hotel => (
                <div key={hotel.id} className="card bg-white shadow-lg p-4 border border-blue-200 flex flex-col items-center">
                  <img src={hotel.image} alt={hotel.name + ' image'} className="w-32 h-20 object-cover rounded-lg border border-blue-200 shadow mb-2" />
                  <div className="font-semibold text-blue-800 text-lg text-center">{hotel.name}</div>
                  <div className="text-sm text-gray-500 text-center mb-1">{hotel.address}</div>
                  <div className="text-xl font-bold text-blue-700">${hotel.price}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="text-gray-500 mb-2">No hotels found for Paris from the API. Showing example hotels:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[{
                  id: 1,
                  name: 'Hotel Le Meurice',
                  price: 350,
                  address: '228 Rue de Rivoli, 75001 Paris',
                  image: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/2b/3c/4d/hotel-le-meurice.jpg'
                }, {
                  id: 2,
                  name: 'Hotel Lutetia',
                  price: 320,
                  address: '45 Boulevard Raspail, 75006 Paris',
                  image: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/2b/3c/4d/hotel-lutetia.jpg'
                }].map(hotel => (
                  <div key={hotel.id} className="card bg-white shadow-lg p-4 border border-blue-200 flex flex-col items-center">
                    <img src={hotel.image} alt={hotel.name + ' image'} className="w-32 h-20 object-cover rounded-lg border border-blue-200 shadow mb-2" />
                    <div className="font-semibold text-blue-800 text-lg text-center">{hotel.name}</div>
                    <div className="text-sm text-gray-500 text-center mb-1">{hotel.address}</div>
                    <div className="text-xl font-bold text-blue-700">${hotel.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        {/* Kathmandu Activities Section */}
        <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-pink-100 mb-2">
          <h1 className="text-2xl font-bold mb-4 text-pink-900 tracking-tight">Activities in Kathmandu</h1>
          <div className="flex flex-wrap gap-3">
            {dummyKathmanduActivities.map(act => {
              const selected = selectedKathmanduActivityIds.includes(act.id);
              return (
                <span key={act.id} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-150 ${selected ? 'bg-pink-100 text-pink-800' : 'bg-gray-200 text-gray-400 line-through'}`}>
                  <TicketIcon className={`w-5 h-5 ${selected ? 'text-pink-400' : 'text-gray-400'}`} />
                  {act.name} <span className={`font-semibold ${selected ? 'text-pink-700' : 'text-gray-400'}`}>${act.price}</span>
                  <button className={`btn btn-xs btn-circle ml-2 ${selected ? 'btn-error' : 'btn-success'}`} onClick={() => handleToggleKathmanduActivity(act.id)}>
                    {selected ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                  </button>
                </span>
              );
            })}
          </div>
        </section>
        {/* Pokhara Section (only if activities exist) */}
        {dummyPokharaActivities.length > 0 && (
          <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-cyan-100 mb-2">
            <h1 className="text-2xl font-bold mb-4 text-cyan-900 tracking-tight">Pokhara Add-on</h1>
            {/* Travel selection (cannot deselect if activities exist) */}
            <div className="mb-4">
              <label className="font-medium mr-2">Travel: </label>
              <select className="select select-bordered" value={selectedPokharaTravel.id} onChange={e => handlePokharaTravelChange(Number(e.target.value))}>
                {dummyPokharaTravel.map(travel => (
                  <option key={travel.id} value={travel.id}>{travel.type} - {travel.name} (${travel.price}){travel.recommended ? ' - Recommended' : ''}</option>
                ))}
              </select>
            </div>
            {/* Pokhara hotel selection */}
            <div className="mb-4">
              <label className="font-medium mr-2">Hotel: </label>
              <select className="select select-bordered" value={selectedPokharaHotel.id} onChange={e => setSelectedPokharaHotel(dummyPokharaHotels.find(h => h.id === Number(e.target.value)))}>
                {dummyPokharaHotels.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>{hotel.name} (${hotel.price}){hotel.recommended ? ' - Recommended' : ''}</option>
                ))}
              </select>
            </div>
            {/* Pokhara activities */}
            <div className="flex flex-wrap gap-3">
              {dummyPokharaActivities.map(act => {
                const selected = selectedPokharaActivityIds.includes(act.id);
                return (
                  <span key={act.id} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-150 ${selected ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-200 text-gray-400 line-through'}`}>
                    <MapPinIcon className={`w-5 h-5 ${selected ? 'text-cyan-400' : 'text-gray-400'}`} />
                    {act.name} <span className={`font-semibold ${selected ? 'text-cyan-700' : 'text-gray-400'}`}>${act.price}</span>
                    <button className={`btn btn-xs btn-circle ml-2 ${selected ? 'btn-error' : 'btn-success'}`} onClick={() => handleTogglePokharaActivity(act.id)}>
                      {selected ? <XMarkIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                    </button>
                  </span>
                );
              })}
            </div>
          </section>
        )}
        {/* Receipt Section */}
        <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-gray-200 mb-2">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Trip Receipt</h1>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {receiptItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td>{item.icon}</td>
                    <td>{item.desc}</td>
                    <td className="font-semibold">${item.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={2} className="text-right">Total</th>
                  <th className="text-xl text-blue-700">${totalPrice}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
      {/* Sticky Footer for Total Price */}
      <div className="bg-white/90 p-6 shadow-lg w-full sticky bottom-0 z-10 border-t border-blue-200">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-blue-900">Total Trip Price: <span className="text-blue-700">${totalPrice}</span></h2>
          <button className="btn btn-secondary" onClick={onBack}>Go Back</button>
        </div>
      </div>
    </div>
  );
} 