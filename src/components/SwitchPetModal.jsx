import React, { useEffect, useState } from 'react';
import { X, Check, Plus, Pencil } from 'lucide-react';

const EMPTY_FORM = {
  name: '', breed: '', category: 'Средняя собака', weightKg: 15, heightCm: 40,
  tempMin: 18, tempMax: 22, vaccinated: false, vetPassport: 'RB', notes: '',
};
const CATEGORIES = ['Крупная собака', 'Средняя собака', 'Маленькая собака', 'Кошка'];
const PASSPORT_LABELS = { RB: 'Беларусь', RF: 'Россия', EU: 'ЕС' };

export function SwitchPetModal({ isOpen, onClose, pets, activePet, onSelectPet, onAddNewPet, onUpdatePet, initialPet }) {
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSaveError('');
    if (initialPet) {
      setForm({ ...EMPTY_FORM, ...initialPet, vaccinated: Boolean(initialPet.vaccinated), vetPassport: initialPet.vetPassport || 'RB' });
      setIsEditingForm(true);
    } else {
      setForm(EMPTY_FORM);
      setIsEditingForm(false);
    }
  }, [isOpen, initialPet]);

  if (!isOpen) return null;
  const editingPet = Boolean(initialPet || form.id);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSavePet = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setSaveError('');
    const payload = {
      ...form,
      name: form.name.trim(),
      breed: form.breed.trim(),
      weightKg: Number(form.weightKg),
      heightCm: Number(form.heightCm),
      tempMin: Number(form.tempMin),
      tempMax: Number(form.tempMax),
      category: form.category,
      vaccinated: Boolean(form.vaccinated),
      requiresCrate: Boolean(form.requiresCrate),
    };
    try {
      const savedPet = editingPet
        ? await onUpdatePet({ ...payload, id: initialPet?.id ?? form.id })
        : await onAddNewPet(payload);
      onSelectPet(savedPet);
      setIsEditingForm(false);
      onClose();
    } catch (error) {
      setSaveError(error.message || 'Не удалось сохранить профиль питомца. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🐾</span>
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {isEditingForm ? (editingPet ? 'Редактировать питомца' : 'Добавить питомца') : 'Выберите питомца'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"><X className="w-4 h-4" /></button>
        </div>

        {!isEditingForm ? (
          <div>
            {pets.length === 0 ? <p className="text-sm text-[#7d6e61] text-center py-5">Питомцев пока нет. Добавьте первого.</p> : (
              <div className="space-y-3 mb-5">
                {pets.map((pet) => {
                  const isSelected = pet.id === activePet?.id;
                  return (
                    <div key={pet.id} className={`flex items-center gap-3 p-3 rounded-2xl ${isSelected ? 'bg-white ring-2 ring-[#c2652a]' : 'bg-white/70 border border-[#e8ded2]'}`}>
                      <button onClick={() => { onSelectPet(pet); onClose(); }} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <div className="w-12 h-12 rounded-xl bg-[#efe6d8] flex items-center justify-center text-xl shrink-0" aria-hidden="true">🐾</div>
                        <span className="min-w-0"><span className="block font-bold text-sm text-[#2a221c] truncate">{pet.name}</span><span className="block text-xs text-[#7d6e61] truncate">{pet.breed} · {pet.category}</span></span>
                        {isSelected && <Check className="w-4 h-4 text-[#c2652a] shrink-0" />}
                      </button>
                      <button onClick={() => { setForm({ ...EMPTY_FORM, ...pet, vaccinated: Boolean(pet.vaccinated), vetPassport: pet.vetPassport || 'RB' }); setIsEditingForm(true); setSaveError(''); }} aria-label={`Редактировать: ${pet.name}`} className="w-9 h-9 rounded-xl bg-[#eee4d6] flex items-center justify-center text-[#5c4e42]"><Pencil className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => { setForm(EMPTY_FORM); setIsEditingForm(true); setSaveError(''); }} className="w-full py-3 rounded-2xl border-2 border-dashed border-[#c2652a]/40 text-[#c2652a] font-semibold text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Добавить нового питомца</button>
          </div>
        ) : (
          <form onSubmit={handleSavePet} className="space-y-3">
            {saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}
            <label className="block text-xs font-semibold text-[#5c4e42]">Кличка
              <input required maxLength="80" value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm" />
            </label>
            <label className="block text-xs font-semibold text-[#5c4e42]">Порода
              <input required maxLength="80" value={form.breed} onChange={(e) => update('breed', e.target.value)} className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm" />
            </label>
            <div><span className="block text-xs font-semibold text-[#5c4e42] mb-1">Категория</span><div className="grid grid-cols-2 gap-2">{CATEGORIES.map((category) => <button type="button" key={category} onClick={() => update('category', category)} className={`py-2 px-3 rounded-xl text-xs border ${form.category === category ? 'bg-[#c2652a] text-white border-[#c2652a]' : 'bg-white text-[#5c4e42] border-[#ded1bf]'}`}>{category}</button>)}</div></div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-[#5c4e42]">Вес: {form.weightKg} кг<input type="range" min="1" max="60" value={form.weightKg} onChange={(e) => update('weightKg', Number(e.target.value))} className="w-full accent-[#c2652a]" /></label>
              <label className="block text-xs font-semibold text-[#5c4e42]">Высота: {form.heightCm} см<input type="range" min="10" max="100" value={form.heightCm} onChange={(e) => update('heightCm', Number(e.target.value))} className="w-full accent-[#c2652a]" /></label>
            </div>
            <div><span className="block text-xs font-semibold text-[#5c4e42] mb-1">Комфортный климат, °C</span><div className="grid grid-cols-2 gap-3"><label className="text-xs text-[#7d6e61]">От<input type="number" min="-50" max="60" required value={form.tempMin} onChange={(e) => update('tempMin', e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-white border border-[#ded1bf] text-sm text-[#2a221c]" /></label><label className="text-xs text-[#7d6e61]">До<input type="number" min="-50" max="60" required value={form.tempMax} onChange={(e) => update('tempMax', e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-white border border-[#ded1bf] text-sm text-[#2a221c]" /></label></div></div>
            <label className="flex items-center gap-2 text-sm text-[#5c4e42]"><input type="checkbox" checked={Boolean(form.vaccinated)} onChange={(e) => update('vaccinated', e.target.checked)} className="accent-[#c2652a] w-4 h-4" />Привит</label>
            <label className="block text-xs font-semibold text-[#5c4e42]">Ветпаспорт
              <select value={form.vetPassport} onChange={(e) => update('vetPassport', e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm">{Object.entries(PASSPORT_LABELS).map(([value, label]) => <option key={value} value={value}>Ветпаспорт {label}</option>)}</select>
            </label>
            <label className="block text-xs font-semibold text-[#5c4e42]">Пожелания (необязательно)<textarea maxLength="500" value={form.notes || ''} onChange={(e) => update('notes', e.target.value)} rows="2" className="mt-1 w-full px-3 py-2 rounded-xl bg-white border border-[#ded1bf] text-sm resize-y" /></label>
            <div className="flex gap-2 pt-1"><button type="button" onClick={() => { setIsEditingForm(false); setSaveError(''); }} className="flex-1 py-2.5 rounded-xl bg-[#eee4d6] text-[#5c4e42] font-semibold text-xs">Отмена</button><button type="submit" disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-[#c2652a] text-white font-semibold text-xs disabled:opacity-60">{isSaving ? 'Сохраняем…' : 'Сохранить'}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
