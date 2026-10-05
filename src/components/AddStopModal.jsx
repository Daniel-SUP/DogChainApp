import React, { useState, useEffect } from 'react';
import { X, Plus, MapPin, Edit3 } from 'lucide-react';

export function AddStopModal({
  isOpen,
  onClose,
  onSaveStop,
  editingIndex = null,
  initialAddress = '',
}) {
  const [stopAddress, setStopAddress] = useState(initialAddress);

  useEffect(() => {
    setStopAddress(initialAddress || '');
  }, [initialAddress, isOpen]);

  if (!isOpen) return null;

  const quickStops = [
    'Зоомагазин «ZOObazar», пр-т Машерова, 17',
    'Вет-аптека «ВетЗоо», ул. Советская, 85',
    'Груминг-салон «Barboskin», ул. Мицкевича, 24',
    'Зоомаркет «Любимчик», ул. Московская, 210',
  ];

  const handleSave = (addr) => {
    const trimmed = (addr || stopAddress).trim();
    if (!trimmed) return;
    onSaveStop(trimmed, editingIndex);
    onClose();
  };

  const isEditing = editingIndex !== null && editingIndex !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit3 className="w-5 h-5 text-[#c2652a]" />
            ) : (
              <Plus className="w-5 h-5 text-[#c2652a]" />
            )}
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {isEditing ? 'Изменить остановку' : 'Добавить остановку в Бресте'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#5c4e42] mb-1">
              Адрес промежуточной точки в Бресте
            </label>
            <input
              type="text"
              placeholder="Введите улицу и номер дома..."
              value={stopAddress}
              onChange={(e) => setStopAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded1bf] text-sm focus:outline-none focus:ring-2 focus:ring-[#c2652a]"
            />
          </div>

          <div className="text-xs font-semibold text-[#7d6e61]">
            Популярные попутные зоо-места:
          </div>
          <div className="space-y-2">
            {quickStops.map((stop, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSave(stop)}
                className="w-full text-left p-2.5 bg-white hover:bg-[#f6efe6] border border-[#e8ded2] rounded-xl text-xs text-[#2a221c] flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#c2652a] shrink-0" />
                <span className="truncate">{stop}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-[#eee4d6] hover:bg-[#e4d8c7] text-[#5c4e42] text-xs font-semibold rounded-xl"
          >
            Отмена
          </button>
          <button
            onClick={() => handleSave(stopAddress)}
            disabled={!stopAddress.trim()}
            className="flex-1 py-3 bg-[#c2652a] hover:bg-[#b05820] disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            {isEditing ? 'Сохранить изменения' : 'Добавить остановку'}
          </button>
        </div>
      </div>
    </div>
  );
}
