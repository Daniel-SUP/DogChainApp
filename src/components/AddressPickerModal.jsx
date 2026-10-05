import React, { useState } from 'react';
import { X, Search, MapPin, Building, Trees, HeartPulse, Loader2, Navigation2 } from 'lucide-react';
import { BREST_LOCATIONS } from '../data/mockData.js';
import { forwardGeocode } from '../utils/geocoding.js';

export function AddressPickerModal({
  isOpen,
  onClose,
  type,
  currentAddress,
  onSelectAddress,
  onSelectOnMap,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const filteredLocations = BREST_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const query = customInput.trim();
    if (!query) return;

    setIsLoading(true);
    const coords = await forwardGeocode(query);
    setIsLoading(false);

    onSelectAddress(query, coords);
    onClose();
  };

  const handleLocationClick = (loc) => {
    onSelectAddress(`${loc.name}, ${loc.address}`, loc.coords);
    onClose();
  };

  const handleChooseOnMap = () => {
    if (onSelectOnMap) {
      onSelectOnMap(type);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#c2652a]" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {type === 'pickup' ? 'Точка подачи в Бресте' : 'Куда едем в Бресте'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: Choose directly on the map */}
        <button
          type="button"
          onClick={handleChooseOnMap}
          className="w-full mb-3.5 py-3 px-4 bg-[#c2652a] hover:bg-[#b05820] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
        >
          <Navigation2 className="w-4 h-4 fill-current" />
          <span>
            {type === 'pickup'
              ? 'Указать точку подачи на карте'
              : 'Указать место назначения на карте'}
          </span>
        </button>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9c8d7f]" />
          <input
            type="text"
            placeholder="Поиск по улицам и клиникам Бреста..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm focus:outline-none focus:ring-2 focus:ring-[#c2652a]"
          />
        </div>

        {/* Quick Custom Input with Nominatim Forward Geocoding */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Или точный адрес (дом, корпус)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#ded1bf] focus:outline-none focus:ring-2 focus:ring-[#c2652a]"
          />
          <button
            type="submit"
            disabled={!customInput.trim() || isLoading}
            className="px-3.5 py-2 bg-[#efe6d8] hover:bg-[#e4d8c7] text-[#4a3e35] disabled:opacity-40 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Найти'}
          </button>
        </form>

        {/* Popular locations list */}
        <div className="space-y-2 mb-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9c8d7f] mb-1">
            Популярные адреса и ветклиники в Бресте
          </div>

          {filteredLocations.map((loc) => {
            const isSelected = currentAddress?.includes(loc.name);
            return (
              <div
                key={loc.id}
                onClick={() => handleLocationClick(loc)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#c2652a]/10 border border-[#c2652a]'
                    : 'bg-white hover:bg-[#f6efe6] border border-[#e8ded2]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    loc.category === 'vet'
                      ? 'bg-red-50 text-red-600'
                      : loc.category === 'park'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-[#efe6d8] text-[#6e5f52]'
                  }`}
                >
                  {loc.category === 'vet' ? (
                    <HeartPulse className="w-4 h-4" />
                  ) : loc.category === 'park' ? (
                    <Trees className="w-4 h-4" />
                  ) : (
                    <Building className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-[#2a221c] leading-tight">
                    {loc.name}
                  </div>
                  <div className="text-[11px] text-[#7d6e61] truncate mt-0.5">
                    {loc.address}
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] bg-[#c2652a] text-white px-2 py-0.5 rounded-full font-bold">
                    Выбрано
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
