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
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const filteredLocations = BREST_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    // Check if matched in filteredLocations first
    if (filteredLocations.length > 0) {
      handleLocationClick(filteredLocations[0]);
      return;
    }

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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#c2652a]" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {type === 'pickup' ? 'Точка подачи в Бресте' : 'Место назначения в Бресте'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Search Form with prominent "Найти" button */}
        <form onSubmit={handleSearchSubmit} className="mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8d7f]" />
              <input
                type="text"
                autoFocus
                placeholder="Улица, дом или клиника в Бресте..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm text-[#2a221c] placeholder:text-[#9c8d7f] focus:outline-none focus:ring-2 focus:ring-[#c2652a]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9c8d7f] hover:text-[#2a221c] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!searchTerm.trim() || isLoading}
              className="px-4 py-2.5 bg-[#c2652a] hover:bg-[#b05820] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Найти</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Action: Choose directly on the map */}
        <button
          type="button"
          onClick={handleChooseOnMap}
          className="w-full mb-3 py-2.5 px-3 bg-[#efe6d8] hover:bg-[#e4d8c7] text-[#4a3e35] rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-[#ded1bf] transition-all cursor-pointer shrink-0"
        >
          <Navigation2 className="w-3.5 h-3.5 text-[#c2652a] fill-current" />
          <span>
            {type === 'pickup'
              ? 'Указать точку подачи на карте Бреста'
              : 'Указать место назначения на карте Бреста'}
          </span>
        </button>

        {/* Locations List (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-2">
          {/* If user typed custom text not directly in predefined list, show quick submit tile */}
          {searchTerm.trim() && filteredLocations.length === 0 && (
            <div
              onClick={() => handleSearchSubmit()}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#c2652a] cursor-pointer hover:bg-[#fbf7f2] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#c2652a]/15 text-[#c2652a] flex items-center justify-center shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-[#2a221c]">
                  Искать «{searchTerm}» в Бресте
                </div>
                <div className="text-[11px] text-[#7d6e61]">
                  Нажмите, чтобы найти адрес через карту OpenStreetMap
                </div>
              </div>
            </div>
          )}

          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9c8d7f] pt-1">
            {searchTerm.trim() ? 'Результаты поиска' : 'Популярные адреса и ветклиники'}
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
                  <span className="text-[10px] bg-[#c2652a] text-white px-2 py-0.5 rounded-full font-bold shrink-0">
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
