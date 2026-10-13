import React from 'react';
import { Plus, Check, Pencil, Trash2 } from 'lucide-react';

const passportNames = { RB: 'Беларусь', RF: 'Россия', EU: 'ЕС' };

export function PetsTab({ pets, activePet, onSelectPet, onOpenAddNew, onEditPet, onDeletePet }) {
  return (
    <div className="px-4 py-4 max-w-md mx-auto pb-24">
      <div className="flex items-center justify-between mb-4"><div><h1 className="font-serif text-2xl font-bold text-[#2a221c]">Мои питомцы</h1><p className="text-xs text-[#6B7280]">Профили питомцев для поездок</p></div><button onClick={onOpenAddNew} className="flex items-center gap-1 bg-[#7A1F3D] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"><Plus className="w-4 h-4" /><span>Добавить</span></button></div>
      <div className="space-y-4">
        {pets.length === 0 && <div className="rounded-2xl border border-dashed border-[#CBD0D8] bg-white/60 p-5 text-center text-sm text-[#6B7280]">Питомцев пока нет. Добавьте первого питомца, чтобы сохранить его профиль.</div>}
        {pets.map((pet) => {
          const isActive = activePet?.id === pet.id;
          return <article key={pet.id} className={`bg-white rounded-3xl p-4 border transition-all ${isActive ? 'border-[#7A1F3D] ring-2 ring-[#7A1F3D]/20 shadow-md' : 'border-[#DFE2E7] shadow-sm'}`}>
            <div className="flex items-start gap-3.5 mb-3">{pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#7A1F3D]/20 shrink-0" referrerPolicy="no-referrer" /> : <div className="w-16 h-16 rounded-2xl bg-[#E8EAEE] flex items-center justify-center text-2xl shrink-0" aria-hidden="true">🐾</div>}<div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2"><h3 className="font-bold text-base text-[#2a221c] truncate">{pet.name}</h3>{isActive ? <span className="text-[10px] font-bold bg-[#7A1F3D] text-white px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"><Check className="w-3 h-3 stroke-[3]" />Активен</span> : <button onClick={() => onSelectPet(pet)} className="text-xs font-semibold text-[#7A1F3D] hover:underline">Выбрать</button>}</div><div className="text-xs text-[#6B7280] mt-0.5">{pet.breed}</div><div className="inline-block bg-[#E9EBEF] text-[#4B5563] text-[10px] font-medium px-2 py-0.5 rounded-md mt-1">{pet.category}</div></div></div>
            <div className="grid grid-cols-3 gap-2 bg-[#F5F6F8] p-2.5 rounded-2xl border border-[#E5E7EB] text-center text-xs mb-3"><div><div className="text-[10px] text-[#8B929E]">Вес</div><div className="font-bold text-[#2a221c]">{pet.weightKg} кг</div></div><div><div className="text-[10px] text-[#8B929E]">Холка</div><div className="font-bold text-[#2a221c]">{pet.heightCm} см</div></div><div><div className="text-[10px] text-[#8B929E]">Климат</div><div className="font-bold text-[#7A1F3D]">{pet.tempMin}°–{pet.tempMax}°C</div></div></div>
            {pet.notes && <div className="text-xs text-[#596170] mb-3 bg-[#F4F5F7] p-2.5 rounded-xl border border-[#E1E4E9]"><span className="font-semibold text-[#2a221c]">Пожелания: </span>{pet.notes}</div>}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">{pet.vaccinated && <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200">✓ Привит</span>}<span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium border border-amber-200">Ветпаспорт: {passportNames[pet.vetPassport] || 'Беларусь'}</span><div className="flex-1"/><button onClick={() => onEditPet(pet)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E5E7EB] text-[#4B5563] font-medium" aria-label={`Редактировать ${pet.name}`}><Pencil className="w-3.5 h-3.5"/>Изменить</button><button onClick={() => onDeletePet(pet)} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 font-medium" aria-label={`Удалить ${pet.name}`}><Trash2 className="w-3.5 h-3.5"/>Удалить</button></div>
          </article>;
        })}
      </div>
    </div>
  );
}
