import React, { useState } from 'react';
import { X, MapPin, Check, Lock, AlertCircle, Building2 } from 'lucide-react';

export function RegionSelectorModal({
  isOpen,
  onClose,
  selectedRegion = 'г. Брест',
  onSelectRegion,
}) {
  const [unavailableCityMessage, setUnavailableCityMessage] = useState('');

  if (!isOpen) return null;

  const cities = [
    {
      id: 'brest',
      name: 'г. Брест',
      description: 'Город и пригород (Брестский район)',
      status: 'active',
      badge: 'Работает сейчас',
    },
    {
      id: 'minsk',
      name: 'г. Минск',
      description: 'Столица и Минский район',
      status: 'locked',
      badge: 'Скоро открытие',
    },
    {
      id: 'grodno',
      name: 'г. Гродно',
      description: 'Гродненская область',
      status: 'locked',
      badge: 'В разработке',
    },
    {
      id: 'gomel',
      name: 'г. Гомель',
      description: 'Гомельская область',
      status: 'locked',
      badge: 'В разработке',
    },
    {
      id: 'vitebsk',
      name: 'г. Витебск',
      description: 'Витебская область',
      status: 'locked',
      badge: 'В разработке',
    },
    {
      id: 'mogilev',
      name: 'г. Могилев',
      description: 'Могилевская область',
      status: 'locked',
      badge: 'В разработке',
    },
  ];

  const handleCityClick = (city) => {
    if (city.status === 'active') {
      onSelectRegion(city.name);
      setUnavailableCityMessage('');
      onClose();
    } else {
      setUnavailableCityMessage(
        `Сервис зоотакси DogChain сейчас работает исключительно в городе Бресте. В ${city.name} запуск запланирован на следующий этап!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#c2652a]" />
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2a221c]">
                Выбор города
              </h2>
              <div className="text-[11px] text-[#7d6e61]">
                Республика Беларусь
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {unavailableCityMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">{unavailableCityMessage}</div>
            <button
              onClick={() => setUnavailableCityMessage('')}
              className="text-amber-700 font-bold hover:text-amber-900 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-2 mb-2">
          {cities.map((city) => {
            const isAvailable = city.status === 'active';
            const isSelected = selectedRegion.includes('Брест') && isAvailable;

            return (
              <div
                key={city.id}
                onClick={() => handleCityClick(city)}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white ring-2 ring-[#c2652a] shadow-sm'
                    : isAvailable
                    ? 'bg-white/80 hover:bg-white border border-[#e8ded2]'
                    : 'bg-[#ede6db]/70 border border-[#dfd6c7] opacity-65 hover:opacity-85'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isAvailable
                        ? 'bg-[#c2652a]/15 text-[#c2652a]'
                        : 'bg-[#dfd5c5] text-[#8c7e70]'
                    }`}
                  >
                    {isAvailable ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2a221c]">
                        {city.name}
                      </span>
                      {isAvailable && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[11px] text-[#7d6e61]">
                      {city.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#dfd5c5] text-[#7a6d60]'
                    }`}
                  >
                    {city.badge}
                  </span>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#c2652a] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
