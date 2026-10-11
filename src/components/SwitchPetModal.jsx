import React, { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';

export function SwitchPetModal({
  isOpen,
  onClose,
  pets,
  activePet,
  onSelectPet,
  onAddNewPet,
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newName, setNewName] = useState('');
  const [newBreed, setNewBreed] = useState('');
  const [newWeight, setNewWeight] = useState(15);
  const [newHeight, setNewHeight] = useState(40);
  const [newCategory, setNewCategory] = useState('Средняя собака');

  if (!isOpen) return null;

  const handleCreatePet = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newBreed.trim() || isSaving) return;

    const created = {
      name: newName.trim(),
      category: newCategory,
      breed: newBreed.trim(),
      notes: 'Привит, ветпаспорт РБ',
      weightKg: newWeight,
      heightCm: newHeight,
      tempMin: 18,
      tempMax: 22,
      photoUrl: activePet?.photoUrl,
      coatType: 'Стандартный',
      temperament: 'Спокойный',
      requiresHammock: true,
      requiresCrate: false,
    };

    setIsSaving(true);
    setSaveError('');
    try {
      const savedPet = await onAddNewPet(created);
      onSelectPet(savedPet);
      setIsAddingNew(false);
      onClose();
    } catch (error) {
      setSaveError(error.message || 'Не удалось сохранить питомца. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {isAddingNew ? 'Добавить питомца' : 'Выберите питомца'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAddingNew ? (
          <div>
            <div className="space-y-3 mb-5">
              {pets.map((pet) => {
                const isSelected = pet.id === activePet?.id;
                return (
                  <div
                    key={pet.id}
                    onClick={() => {
                      onSelectPet(pet);
                      onClose();
                    }}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white ring-2 ring-[#c2652a] shadow-sm'
                        : 'bg-white/70 hover:bg-white border border-[#e8ded2]'
                    }`}
                  >
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#c2652a]/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#2a221c]">{pet.name}</span>
                        <span className="bg-[#efe7db] text-[#6d5e51] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {pet.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#7d6e61] truncate mt-0.5">{pet.breed}</p>
                      <div className="text-[11px] text-[#9c8d7f] mt-1">
                        {pet.weightKg} кг · холка {pet.heightCm} см · {pet.tempMin}°C–{pet.tempMax}°C
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-[#c2652a] text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-[#c2652a]/40 text-[#c2652a] hover:bg-[#c2652a]/5 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить нового питомца</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreatePet} className="space-y-4">
            {saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}
            <div>
              <label className="block text-xs font-semibold text-[#5c4e42] mb-1">
                Кличка питомца
              </label>
              <input
                type="text"
                required
                placeholder="например: Арчи, Майло, Луна"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm focus:outline-none focus:ring-2 focus:ring-[#c2652a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c4e42] mb-1">
                Порода
              </label>
              <input
                type="text"
                required
                placeholder="например: Лабрадор, Бигль, Корги"
                value={newBreed}
                onChange={(e) => setNewBreed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm focus:outline-none focus:ring-2 focus:ring-[#c2652a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c4e42] mb-1">
                Категория
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Крупная собака', 'Средняя собака', 'Маленькая собака', 'Кошка'].map(
                  (cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-colors ${
                        newCategory === cat
                          ? 'bg-[#c2652a] text-white border-[#c2652a]'
                          : 'bg-white text-[#5c4e42] border-[#ded1bf]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5c4e42] mb-1">
                  Вес: {newWeight} кг
                </label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full accent-[#c2652a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5c4e42] mb-1">
                  Высота в холке: {newHeight} см
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={newHeight}
                  onChange={(e) => setNewHeight(Number(e.target.value))}
                  className="w-full accent-[#c2652a]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#eee4d6] text-[#5c4e42] font-semibold text-xs"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl bg-[#c2652a] text-white font-semibold text-xs shadow-md"
              >
                Сохранить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
