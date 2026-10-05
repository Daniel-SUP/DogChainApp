import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';

export function ScheduleModal({ isOpen, onClose, onSchedule }) {
  const [selectedDay, setSelectedDay] = useState('Сегодня');
  const [selectedTime, setSelectedTime] = useState('16:00');

  if (!isOpen) return null;

  const times = ['14:30', '15:00', '16:00', '17:30', '19:00', '20:30'];

  const handleConfirm = () => {
    onSchedule(`${selectedDay}, ${selectedTime}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#c2652a]" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              Заказ на определенное время
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#5c4e42] mb-2">
            Дата поездки
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Сегодня', 'Завтра', 'Послезавтра'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors ${
                  selectedDay === day
                    ? 'bg-[#c2652a] text-white border-[#c2652a]'
                    : 'bg-white text-[#5c4e42] border-[#ded1bf]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#5c4e42] mb-2">
            Время подачи в Бресте
          </label>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-colors ${
                  selectedTime === t
                    ? 'bg-[#c2652a] text-white border-[#c2652a]'
                    : 'bg-white text-[#5c4e42] border-[#ded1bf]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onSchedule('');
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-[#eee4d6] text-[#5c4e42] font-semibold text-xs"
          >
            Сбросить
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-[#c2652a] text-white font-semibold text-xs shadow-md"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}
