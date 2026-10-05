import React, { useState } from 'react';
import { X, MapPin, Check, Lock, AlertCircle } from 'lucide-react';

export function RegionSelectorModal({
  isOpen,
  onClose,
  selectedDistrict,
  onSelectDistrict,
}) {
  const [unavailableCityMessage, setUnavailableCityMessage] = useState('');

  if (!isOpen) return null;

  const brestDistricts = [
    { id: 'Брест, Центр', name: 'Центр (Советская, Гоголя, Машерова)', status: 'active' },
    { id: 'Брест, Восток', name: 'Восток (Московская, Партизанский пр-т)', status: 'active' },
    { id: 'Брест, Ковалево', name: 'Ковалево (Луцкая, 28 Июля)', status: 'active' },
    { id: 'Брест, Юго-Запад', name: 'Юго-Запад (Варшавское шоссе)', status: 'active' },
    { id: 'Брест, Речица', name: 'Речица (Писателя Смирнова)', status: 'active' },
    { id: 'Брест, Граевка', name: 'Граевка (Красногвардейская)', status: 'active' },
  ];

  const otherRegions = [
    { id: 'minsk', name: 'г. Минск', status: 'Скоро открытие' },
    { id: 'grodno', name: 'г. Гродно', status: 'В разработке' },
    { id: 'gomel', name: 'г. Гомель', status: 'В разработке' },
    { id: 'vitebsk', name: 'г. Витебск', status: 'В разработке' },
    { id: 'mogilev', name: 'г. Могилев', status: 'В разработке' },
  ];

  const handleSelectUnavailable = (cityName) => {
    setUnavailableCityMessage(
      `Сервис зоотакси DogChain сейчас эксклюзивно доступен только в городе Бресте и его пригороде. Запуск в ${cityName} запланирован на следующий этап!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#c2652a]" />
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2a221c]">
                Выбор региона
              </h2>
              <div className="text-[11px] text-[#7d6e61]">
                Республика Беларусь
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"
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
              className="text-amber-700 font-bold hover:text-amber-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Available Region: Brest */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-serif text-base font-bold text-[#2a221c]">
                г. Брест (Доступен)
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Работает сейчас
            </span>
          </div>

          <div className="space-y-1.5">
            {brestDistricts.map((district) => {
              const isSelected = selectedDistrict === district.id;
              return (
                <div
                  key={district.id}
                  onClick={() => {
                    onSelectDistrict(district.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white ring-2 ring-[#c2652a] shadow-sm'
                      : 'bg-white/80 hover:bg-white border border-[#e8ded2]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">📍</span>
                    <div>
                      <div className="text-xs font-bold text-[#2a221c]">
                        {district.id}
                      </div>
                      <div className="text-[11px] text-[#7d6e61]">
                        {district.name}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#c2652a] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Other regions (Locked / Coming soon) */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#9c8d7f] mb-2">
            Другие регионы Беларуси (Скоро)
          </div>

          <div className="space-y-1.5 opacity-70">
            {otherRegions.map((region) => (
              <div
                key={region.id}
                onClick={() => handleSelectUnavailable(region.name)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#eee7dc] border border-[#ded5c6] cursor-pointer hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#9c8d7f]" />
                  <span className="text-xs font-bold text-[#6d5e51]">
                    {region.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#8c7e70] font-medium bg-[#e4dacb] px-2 py-0.5 rounded-full">
                  {region.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
