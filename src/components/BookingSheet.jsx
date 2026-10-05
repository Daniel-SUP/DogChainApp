import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Edit2,
  ArrowUpDown,
  Clock,
  PlusCircle,
  Bookmark,
  Sliders,
  ChevronDown,
  Wind,
  Fan,
  Check,
  CreditCard,
  Banknote,
  Sparkles,
  Trash2,
} from 'lucide-react';

export function BookingSheet({
  activePet,
  tariffs,
  selectedTariff,
  onSelectTariff,
  onOpenSwitchPet,
  onOpenSchedule,
  onOpenAddStop,
  onEditStop,
  onDeleteStop,
  onOpenAddressPicker,
  onOpenPaymentModal,
  selectedPaymentMethod,
  onOrderRide,
  pickupAddress,
  destinationAddress,
  onSwapAddresses,
  scheduledTime,
  additionalStops = [],
}) {
  const [petWeight, setPetWeight] = useState(activePet?.weightKg || 28);
  const [petHeight, setPetHeight] = useState(activePet?.heightCm || 58);
  const [climateMin, setClimateMin] = useState(activePet?.tempMin || 18);
  const [climateMax, setClimateMax] = useState(activePet?.tempMax || 21);
  const [isSavedRoute, setIsSavedRoute] = useState(false);
  const [rearVentsOn, setRearVentsOn] = useState(true);
  const [gentleAirflow, setGentleAirflow] = useState(true);

  useEffect(() => {
    if (activePet) {
      setPetWeight(activePet.weightKg);
      setPetHeight(activePet.heightCm);
      setClimateMin(activePet.tempMin);
      setClimateMax(activePet.tempMax);
    }
  }, [activePet]);

  const discountAmount = 5;
  const finalPrice = Math.max(10, (selectedTariff?.priceByn || 26) - discountAmount);

  return (
    <div className="bg-[#faf5ee] rounded-t-[32px] shadow-2xl border-t border-[#ded1bf] px-4 pt-3 pb-8 -mt-6 relative z-20 transition-all">
      {/* Top Grab Handle */}
      <div className="w-12 h-1.5 bg-[#d8ccbc] rounded-full mx-auto mb-4" />

      {/* Sheet Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2a221c] tracking-tight">
            Заказ поездки для питомца
          </h1>
          <p className="text-xs text-[#7d6e61] mt-0.5">
            Водители с сертификацией зоо-первой помощи и климат-контроль
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#efe6d8] text-[#5c4e42] px-2.5 py-1 rounded-full text-xs font-semibold border border-[#dcd0bf] whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Застраховано</span>
        </div>
      </div>

      {/* Pickup, Intermediate Stops & Destination Box */}
      <div className="bg-white rounded-2xl p-4 border border-[#e5d9c9] shadow-sm mb-4">
        {/* Pickup Row */}
        <div className="flex items-center gap-3">
          <div className="w-4 flex flex-col items-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="w-0.5 h-7 border-l-2 border-dashed border-[#dcd0bf] my-1" />
          </div>
          <div
            onClick={() => onOpenAddressPicker('pickup')}
            className="flex-1 cursor-pointer group"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9c8d7f]">
              ТОЧКА ПОДАЧИ
            </span>
            <div className="text-sm font-semibold text-[#2a221c] group-hover:text-[#c2652a] transition-colors line-clamp-1">
              {pickupAddress}
            </div>
          </div>
          <button
            onClick={() => onOpenAddressPicker('pickup')}
            className="p-2 text-[#9c8d7f] hover:text-[#c2652a] rounded-lg hover:bg-[#faf5ee]"
            title="Изменить адрес подачи"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Intermediate stops with Edit and Delete capabilities */}
        {additionalStops.map((stop, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 pl-1 py-1.5 my-1 bg-[#faf6f0] rounded-xl px-2.5 border border-[#eee4d6] group"
          >
            <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
                Остановка #{idx + 1}
              </span>
              <span className="text-xs font-semibold text-[#2a221c] truncate block">
                {stop}
              </span>
            </div>
            {/* Edit Stop Button */}
            <button
              type="button"
              onClick={() => onEditStop(idx)}
              className="p-1.5 text-[#9c8d7f] hover:text-[#c2652a] rounded-lg hover:bg-white transition-colors"
              title="Изменить остановку"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {/* Delete Stop Button */}
            <button
              type="button"
              onClick={() => onDeleteStop(idx)}
              className="p-1.5 text-[#9c8d7f] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Удалить остановку"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Destination Row */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-4 flex flex-col items-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#c2652a] ring-4 ring-[#c2652a]/20" />
          </div>
          <div
            onClick={() => onOpenAddressPicker('destination')}
            className="flex-1 cursor-pointer group"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9c8d7f]">
              МЕСТО НАЗНАЧЕНИЯ
            </span>
            <div className="text-sm font-semibold text-[#2a221c] group-hover:text-[#c2652a] transition-colors line-clamp-1">
              {destinationAddress}
            </div>
          </div>
          <button
            onClick={onSwapAddresses}
            className="p-2 text-[#9c8d7f] hover:text-[#c2652a] rounded-lg hover:bg-[#faf5ee]"
            title="Поменять местами"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-actions: Ride Later, Add Stop, Save Route */}
        <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[#f2eae0]">
          <button
            onClick={onOpenSchedule}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-colors ${
              scheduledTime
                ? 'bg-[#c2652a]/10 text-[#c2652a] font-semibold'
                : 'text-[#6e5f52] hover:bg-[#faf5ee]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="truncate">{scheduledTime ? scheduledTime : 'Позже'}</span>
          </button>

          <button
            onClick={onOpenAddStop}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium text-[#6e5f52] hover:bg-[#faf5ee] transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="truncate">+ Остановка</span>
          </button>

          <button
            onClick={() => setIsSavedRoute(!isSavedRoute)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-colors ${
              isSavedRoute
                ? 'bg-amber-100 text-amber-900 font-semibold'
                : 'text-[#6e5f52] hover:bg-[#faf5ee]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="truncate">{isSavedRoute ? 'Сохранено' : 'Маршрут'}</span>
          </button>
        </div>
      </div>

      {/* Pet Traveler Specs Section */}
      <div className="bg-white rounded-2xl p-4 border border-[#e5d9c9] shadow-sm mb-4">
        {/* Section title & switch pet */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[#2a221c] font-serif text-lg font-bold">
            <span className="text-[#c2652a]">🐾</span>
            <span>Параметры пассажира-питомца</span>
          </div>
          <button
            onClick={onOpenSwitchPet}
            className="flex items-center gap-1 text-xs font-semibold text-[#c2652a] hover:text-[#9e4c19] transition-colors"
          >
            <span>Сменить питомца</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pet Card Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#faf6f0] border border-[#eee4d6] mb-4">
          <img
            src={activePet?.photoUrl}
            alt={activePet?.name}
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#c2652a]/20"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#2a221c]">{activePet?.name}</span>
              <span className="bg-[#eee3d4] text-[#6d5e51] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {activePet?.category}
              </span>
            </div>
            <p className="text-xs text-[#7d6e61] truncate mt-0.5">
              {activePet?.breed} ({activePet?.notes})
            </p>
          </div>
          <button
            onClick={onOpenSwitchPet}
            className="p-2 text-[#9c8d7f] hover:text-[#c2652a]"
            title="Детали питомца"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders: Pet Weight & Shoulder Height */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Weight */}
          <div className="bg-[#faf6f0] p-3 rounded-xl border border-[#eee4d6]">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-[#7d6e61]">Вес питомца</span>
              <span className="text-sm font-bold text-[#c2652a]">{petWeight} кг</span>
            </div>
            <input
              type="range"
              min="2"
              max="70"
              value={petWeight}
              onChange={(e) => setPetWeight(Number(e.target.value))}
              className="w-full accent-[#c2652a] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9c8d7f] mt-1">
              <span>0 кг</span>
              <span className="font-medium text-[#6e5f52]">
                {petWeight < 12 ? 'Маленький' : petWeight < 35 ? 'Средний/Крупный' : 'Гигант'}
              </span>
              <span>60+ кг</span>
            </div>
          </div>

          {/* Shoulder Height */}
          <div className="bg-[#faf6f0] p-3 rounded-xl border border-[#eee4d6]">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-[#7d6e61]">Высота в холке</span>
              <span className="text-sm font-bold text-[#c2652a]">{petHeight} см</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={petHeight}
              onChange={(e) => setPetHeight(Number(e.target.value))}
              className="w-full accent-[#c2652a] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9c8d7f] mt-1">
              <span>15 см</span>
              <span className="font-medium text-[#6e5f52]">
                {petHeight <= 35 ? 'Седан' : petHeight <= 65 ? 'Стандарт SUV' : 'Минивэн'}
              </span>
              <span>90 см</span>
            </div>
          </div>
        </div>

        {/* Cabin Climate Range Box */}
        <div className="bg-[#faf6f0] p-3.5 rounded-xl border border-[#eee4d6]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2a221c]">
              <span className="text-[#c2652a]">❄️</span>
              <span>Климат в салоне</span>
            </div>
            <div className="text-xs font-bold text-[#c2652a] bg-white px-2 py-0.5 rounded-md border border-[#e5d9c9]">
              {climateMin}°C – {climateMax}°C
            </div>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="15"
              max="26"
              value={climateMin}
              onChange={(e) => {
                const val = Number(e.target.value);
                setClimateMin(val);
                if (val + 3 > climateMax) setClimateMax(val + 3);
              }}
              className="w-full accent-[#c2652a] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9c8d7f] mt-1">
              <span>15°C (Прохладно)</span>
              <span className="font-semibold text-[#6e5f52]">
                Оптимально для {activePet?.breed?.toLowerCase()}
              </span>
              <span>26°C (Тепло)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#eee4d6]">
            <button
              onClick={() => setGentleAirflow(!gentleAirflow)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                gentleAirflow
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-white text-[#7d6e61] border border-[#e5d9c9]'
              }`}
            >
              <Wind className="w-3 h-3 text-emerald-600" />
              <span>Мягкий обдув для двойной шерсти</span>
            </button>

            <button
              onClick={() => setRearVentsOn(!rearVentsOn)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                rearVentsOn
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'bg-white text-[#7d6e61] border border-[#e5d9c9]'
              }`}
            >
              <Fan className="w-3 h-3 text-amber-600" />
              <span>Задние дефлекторы ВКЛ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Zoo Tariff */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-serif text-lg font-bold text-[#2a221c]">
            Выберите тариф ЗооТакси
          </h2>
          <span className="text-xs text-[#7d6e61]">3 класса авто доступно</span>
        </div>

        {/* 3 Tariff Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {tariffs.map((tariff) => {
            const isSelected = selectedTariff?.id === tariff.id;
            return (
              <div
                key={tariff.id}
                onClick={() => onSelectTariff(tariff)}
                className={`relative flex flex-col justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#fffdfa] ring-2 ring-[#c2652a] shadow-md border-transparent'
                    : 'bg-white hover:bg-[#faf7f2] border border-[#e5d9c9]'
                }`}
              >
                {tariff.isPopular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#c2652a] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                    Хит заказов
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#c2652a] text-white' : 'bg-[#efe6d8] text-[#5c4e42]'
                      }`}
                    >
                      <span className="text-base">🚗</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#7d6e61]">
                      {tariff.etaMin} мин
                    </span>
                  </div>

                  <div className="font-bold text-xs text-[#2a221c] leading-tight">
                    {tariff.title}
                  </div>
                  <p className="text-[10px] text-[#7d6e61] line-clamp-2 mt-1 mb-2 leading-snug">
                    {tariff.sub} · {tariff.features}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f4ecdf]">
                  <div className="text-sm font-extrabold text-[#c2652a]">
                    {tariff.priceByn.toFixed(2)} Br
                  </div>
                  <div className="text-[10px] text-[#9c8d7f] truncate">
                    {tariff.carType}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment & Promo row with working "Изменить" handler */}
      <div className="bg-white rounded-2xl p-3 border border-[#e5d9c9] flex items-center justify-between mb-4">
        <div
          onClick={onOpenPaymentModal}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2a221c] text-white flex items-center justify-center shrink-0">
            {selectedPaymentMethod?.type === 'cash' ? (
              <Banknote className="w-4 h-4 text-emerald-400" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-[#2a221c] group-hover:text-[#c2652a] transition-colors truncate">
              {selectedPaymentMethod?.title || 'Белкарт •••• 9210'}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>-5.00 Br Скидка BRESTPET</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenPaymentModal}
          className="text-xs font-semibold text-[#c2652a] hover:text-[#9e4c19] px-2 py-1.5 rounded-lg hover:bg-[#faf5ee] transition-colors cursor-pointer"
        >
          Изменить
        </button>
      </div>

      {/* Main Order CTA Button */}
      <button
        onClick={onOrderRide}
        className="w-full bg-[#c2652a] hover:bg-[#b05820] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-between shadow-lg shadow-[#c2652a]/25 transition-all active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <span className="text-base font-semibold">Заказать ЗооТакси</span>
        </div>
        <span className="text-lg font-extrabold">{finalPrice.toFixed(2)} Br →</span>
      </button>

      {/* Safety & equipment guarantee text */}
      <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#7d6e61] mt-3">
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Вет-аптечка первой помощи на борту и защитная перегородка включены.</span>
      </div>
    </div>
  );
}
