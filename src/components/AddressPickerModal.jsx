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
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

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

  const handleUseCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Этот браузер не поддерживает определение геопозиции.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const point = [coords.latitude, coords.longitude];
        const address = await reverseGeocode(coords.latitude, coords.longitude);
        onSelectAddress(address, point);
        setIsLocating(false);
        onClose();
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Разрешите доступ к геопозиции в настройках браузера.'
          : error.code === error.TIMEOUT
            ? 'Не удалось определить местоположение вовремя. Попробуйте ещё раз.'
            : 'Не удалось определить местоположение. Проверьте настройки геолокации устройства.';
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F4F5F7] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#D5D9DF] shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE2E7] mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#7A1F3D]" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {type === 'pickup' ? 'Точка подачи в Бресте' : 'Место назначения в Бресте'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:bg-[#D9DDE3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Search Form with prominent "Найти" button */}
        <form onSubmit={handleSearchSubmit} className="mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B929E]" />
              <input
                type="text"
                autoFocus
                placeholder="Улица, дом или клиника в Бресте..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-[#D5D9DF] text-sm text-[#2a221c] placeholder:text-[#8B929E] focus:outline-none focus:ring-2 focus:ring-[#7A1F3D]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B929E] hover:text-[#2a221c] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!searchTerm.trim() || isLoading}
              className="px-4 py-2.5 bg-[#7A1F3D] hover:bg-[#65182F] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
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
          className="w-full mb-3 py-2.5 px-3 bg-[#E8EAEE] hover:bg-[#DCE0E6] text-[#4B5563] rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-[#D5D9DF] transition-all cursor-pointer shrink-0"
        >
          <Navigation2 className="w-3.5 h-3.5 text-[#7A1F3D] fill-current" />
          <span>
            {type === 'pickup'
              ? 'Указать точку подачи на карте Бреста'
              : 'Указать место назначения на карте Бреста'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating || isLoading}
          className="w-full mb-3 py-2.5 px-3 bg-white hover:bg-[#F8F9FA] disabled:opacity-60 text-[#7A1F3D] rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-[#D5D9DF] transition-all cursor-pointer shrink-0"
        >
          {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation2 className="w-3.5 h-3.5" />}
          <span>{isLocating ? 'Определяем местоположение…' : 'Моё местоположение'}</span>
        </button>
        {locationError && <p role="alert" className="mb-3 text-xs text-red-700">{locationError}</p>}

        {/* Locations List (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-2">
          {/* If user typed custom text not directly in predefined list, show quick submit tile */}
          {searchTerm.trim() && filteredLocations.length === 0 && (
            <div
              onClick={() => handleSearchSubmit()}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#7A1F3D] cursor-pointer hover:bg-[#F8F9FA] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#7A1F3D]/15 text-[#7A1F3D] flex items-center justify-center shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-[#2a221c]">
                  Искать «{searchTerm}» в Бресте
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  Нажмите, чтобы найти адрес через карту OpenStreetMap
                </div>
              </div>
            </div>
          )}

          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B929E] pt-1">
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
                    ? 'bg-[#7A1F3D]/10 border border-[#7A1F3D]'
                    : 'bg-white hover:bg-[#F0F2F5] border border-[#E1E4E9]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    loc.category === 'vet'
                      ? 'bg-red-50 text-red-600'
                      : loc.category === 'park'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-[#E8EAEE] text-[#596170]'
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
                  <div className="text-[11px] text-[#6B7280] truncate mt-0.5">
                    {loc.address}
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] bg-[#7A1F3D] text-white px-2 py-0.5 rounded-full font-bold shrink-0">
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
