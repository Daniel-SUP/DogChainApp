import React from 'react';
import { Plus, ShieldCheck, Thermometer, Sliders, Check } from 'lucide-react';

export function PetsTab({ pets, activePet, onSelectPet, onOpenAddNew }) {
  return (
    <div className="px-4 py-4 max-w-md mx-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2a221c]">
            Мои питомцы
          </h1>
          <p className="text-xs text-[#7d6e61]">Пассажирские профили для поездок</p>
        </div>
        <button
          onClick={onOpenAddNew}
          className="flex items-center gap-1 bg-[#c2652a] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить</span>
        </button>
      </div>

      <div className="space-y-4">
        {pets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d8c8b5] bg-white/60 p-5 text-center text-sm text-[#7d6e61]">
            Питомцев пока нет. Добавьте первого питомца, чтобы сохранить его профиль.
          </div>
        )}
        {pets.map((pet) => {
          const isActive = activePet?.id === pet.id;
          return (
            <div
              key={pet.id}
              className={`bg-white rounded-3xl p-4 border transition-all ${
                isActive
                  ? 'border-[#c2652a] ring-2 ring-[#c2652a]/20 shadow-md'
                  : 'border-[#e5d9c9] hover:border-[#c2652a]/40 shadow-sm'
              }`}
            >
              {/* Pet Card Header */}
              <div className="flex items-start gap-3.5 mb-3">
                {pet.photoUrl ? (
                  <img
                    src={pet.photoUrl}
                    alt={pet.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#c2652a]/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#efe6d8] flex items-center justify-center text-2xl shrink-0" aria-hidden="true">🐾</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#2a221c] truncate">{pet.name}</h3>
                    {isActive ? (
                      <span className="text-[10px] font-bold bg-[#c2652a] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Активен
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectPet(pet)}
                        className="text-xs font-semibold text-[#c2652a] hover:underline"
                      >
                        Выбрать
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-[#7d6e61] mt-0.5">{pet.breed}</div>
                  <div className="inline-block bg-[#efe7db] text-[#55473c] text-[10px] font-medium px-2 py-0.5 rounded-md mt-1">
                    {pet.category}
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#faf6f0] p-2.5 rounded-2xl border border-[#eee4d6] text-center text-xs mb-3">
                <div>
                  <div className="text-[10px] text-[#9c8d7f]">Вес</div>
                  <div className="font-bold text-[#2a221c]">{pet.weightKg} кг</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9c8d7f]">Холка</div>
                  <div className="font-bold text-[#2a221c]">{pet.heightCm} см</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#9c8d7f]">Климат</div>
                  <div className="font-bold text-[#c2652a]">
                    {pet.tempMin}°–{pet.tempMax}°C
                  </div>
                </div>
              </div>

              {/* Pet travel notes */}
              <div className="text-xs text-[#6e5f52] mb-3 bg-[#faf5ee] p-2.5 rounded-xl border border-[#e8ded2]">
                <span className="font-semibold text-[#2a221c]">Пожелания: </span>
                {pet.notes}
              </div>

              {/* Equipment badges */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {pet.requiresHammock && (
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                    ✓ Защитный авто-гамак
                  </span>
                )}
                {pet.requiresCrate && (
                  <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-medium border border-sky-200">
                    ✓ Бокс для перевозки
                  </span>
                )}
                <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                  ✓ Ветпаспорт проверен
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
