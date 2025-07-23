/**
 * SecondPage expects the following props/data to be forwarded from page 1:
 * - originCity: { code, name, iata }
 * - selectedKathmanduActivities: [ { name, price } ]
 * - selectedPokharaActivities: [ { name, price } ]
 * - (optionally) selectedHotel, selectedFlight, selectedPokharaHotel, selectedPokharaTravel
 * For now, all data is dummy and activities are pre-selected. Update integration as needed.
 */
import React, { useState } from 'react';
import { ArrowRightIcon, BuildingOffice2Icon, TicketIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import dummyCities from './data/dummyCities.json';

// Dummy data
const dummyFlights = [
  { id: 1, airline: 'Qatar Airways', price: 843, from: 'JFK', to: 'KTM', layovers: ['DOH'], duration: '18h 30m' },
  { id: 2, airline: 'Air India', price: 864, from: 'JFK', to: 'KTM', layovers: ['DEL'], duration: '19h 15m' },
  { id: 3, airline: 'Emirates', price: 910, from: 'JFK', to: 'KTM', layovers: ['DXB'], duration: '20h 10m' }
];
const dummyHotels = [
  { id: 1, name: 'Hotel Yak & Yeti', price: 120, address: 'Durbar Marg, Kathmandu', recommended: true },
  { id: 2, name: 'Hotel Shanker', price: 90, address: 'Lazimpat, Kathmandu' },
  { id: 3, name: 'Hotel Mulberry', price: 110, address: 'Jyatha, Thamel, Kathmandu' },
  { id: 4, name: 'Hotel Himalaya', price: 80, address: 'Kumaripati, Lalitpur' },
  { id: 5, name: 'Hotel Moonlight', price: 70, address: 'Paknajol, Thamel, Kathmandu' }
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
  const [selectedHotel, setSelectedHotel] = useState(dummyHotels.find(h => h.recommended) || dummyHotels[0]);
  const [kathmanduActivities, setKathmanduActivities] = useState([...dummyKathmanduActivities]);
  const [pokharaActivities, setPokharaActivities] = useState([...dummyPokharaActivities]);
  const [showPokhara, setShowPokhara] = useState(pokharaActivities.length > 0);
  const [selectedPokharaTravel, setSelectedPokharaTravel] = useState(dummyPokharaTravel.find(t => t.recommended) || dummyPokharaTravel[0]);
  const [selectedPokharaHotel, setSelectedPokharaHotel] = useState(dummyPokharaHotels.find(h => h.recommended) || dummyPokharaHotels[0]);
  const [showTravelPopup, setShowTravelPopup] = useState(false);

  // Remove activity handlers
  const handleRemoveKathmanduActivity = (id) => setKathmanduActivities(acts => acts.filter(a => a.id !== id));
  const handleRemovePokharaActivity = (id) => {
    setPokharaActivities(acts => {
      const newActs = acts.filter(a => a.id !== id);
      if (newActs.length === 0) setShowPokhara(false);
      return newActs;
    });
  };

  // Prevent removing Pokhara travel if activities exist
  const handlePokharaTravelChange = (id) => {
    if (pokharaActivities.length > 0 && id === null) {
      setShowTravelPopup(true);
      return;
    }
    setSelectedPokharaTravel(dummyPokharaTravel.find(t => t.id === id));
  };

  // Receipt calculation
  const receiptItems = [
    { type: 'Flight', desc: `NYC → KTM (${selectedFlight.airline})`, price: selectedFlight.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-500 inline-block mr-1" /> },
    { type: 'Hotel', desc: `Kathmandu: ${selectedHotel.name}`, price: selectedHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-500 inline-block mr-1" /> },
    ...kathmanduActivities.map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-500 inline-block mr-1" /> })),
  ];
  if (showPokhara && pokharaActivities.length > 0) {
    receiptItems.push(
      { type: 'Travel', desc: `KTM → PKR (${selectedPokharaTravel.name})`, price: selectedPokharaTravel.price, icon: <ArrowRightIcon className="w-5 h-5 text-blue-500 inline-block mr-1" /> },
      { type: 'Hotel', desc: `Pokhara: ${selectedPokharaHotel.name}`, price: selectedPokharaHotel.price, icon: <BuildingOffice2Icon className="w-5 h-5 text-green-500 inline-block mr-1" /> },
      ...pokharaActivities.map(a => ({ type: 'Activity', desc: a.name, price: a.price, icon: <TicketIcon className="w-5 h-5 text-pink-500 inline-block mr-1" /> })),
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
            <ArrowRightIcon className="w-8 h-8 text-blue-500" />
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
          <select className="select select-bordered w-full mb-4" value={selectedHotel.id} onChange={e => setSelectedHotel(dummyHotels.find(h => h.id === Number(e.target.value)))}>
            {dummyHotels.map(hotel => (
              <option key={hotel.id} value={hotel.id}>{hotel.name} (${hotel.price}){hotel.recommended ? ' - Recommended' : ''}</option>
            ))}
          </select>
          <div className="flex items-center gap-4 bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-4 shadow-inner">
            <BuildingOffice2Icon className="w-8 h-8 text-green-500" />
            <div className="flex-1">
              <div className="font-semibold text-green-800 text-lg">{selectedHotel.name} {selectedHotel.recommended && <span className="badge badge-success ml-2">Recommended</span>}</div>
              <div className="text-sm text-gray-500">{selectedHotel.address}</div>
            </div>
            <div className="text-xl font-bold text-green-700">${selectedHotel.price}</div>
          </div>
        </section>
        {/* Kathmandu Activities Section */}
        <section className="rounded-2xl shadow-xl bg-white/90 p-6 border border-pink-100 mb-2">
          <h1 className="text-2xl font-bold mb-4 text-pink-900 tracking-tight">Activities in Kathmandu</h1>
          <div className="flex flex-wrap gap-3">
            {kathmanduActivities.map(act => (
              <span key={act.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-800 font-medium shadow-sm">
                <TicketIcon className="w-5 h-5 text-pink-400" />
                {act.name} <span className="text-pink-700 font-semibold">${act.price}</span>
                <button className="btn btn-xs btn-circle btn-error ml-2" onClick={() => handleRemoveKathmanduActivity(act.id)}><XMarkIcon className="w-4 h-4" /></button>
              </span>
            ))}
            {kathmanduActivities.length === 0 && <span className="text-gray-500">No activities selected.</span>}
          </div>
        </section>
        {/* Pokhara Section (only if activities exist) */}
        {pokharaActivities.length > 0 && (
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
              {pokharaActivities.map(act => (
                <span key={act.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-800 font-medium shadow-sm">
                  <MapPinIcon className="w-5 h-5 text-cyan-400" />
                  {act.name} <span className="text-cyan-700 font-semibold">${act.price}</span>
                  <button className="btn btn-xs btn-circle btn-error ml-2" onClick={() => handleRemovePokharaActivity(act.id)}><XMarkIcon className="w-4 h-4" /></button>
                </span>
              ))}
              {pokharaActivities.length === 0 && <span className="text-gray-500">No activities selected.</span>}
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