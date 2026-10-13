import React from 'react';
import { X, ShieldCheck, Wind, Thermometer, Droplets } from 'lucide-react';

export function ClimateInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F4F5F7] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#D5D9DF] shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE2E7] mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7A1F3D]" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              Система «Климат-Контроль»
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:bg-[#D9DDE3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-[#4B5563] leading-relaxed">
          <p className="font-medium text-[#2a221c]">
            В каждом автомобиле DogChain в Бресте салон оснащен специализированной системой терморегуляции с учетом физиологии домашних животных.
          </p>

          <div className="p-3 bg-white rounded-2xl border border-[#E1E4E9] flex gap-3">
            <Thermometer className="w-5 h-5 text-[#7A1F3D] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2a221c] mb-0.5">
                Автономный микроклимат
              </div>
              <div>
                Температура на заднем ряду поддерживается с точностью до 0.5°C без риска переохлаждения или теплового удара.
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E1E4E9] flex gap-3">
            <Wind className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2a221c] mb-0.5">
                HEPA-фильтрация и мягкий обдув
              </div>
              <div>
                Поток воздуха рассеивается так, чтобы не дуть прямо в глаза и уши животного, исключая конъюнктивит и отиты.
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#E1E4E9] flex gap-3">
            <Droplets className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2a221c] mb-0.5">
                Гидратация и свежая вода
              </div>
              <div>
                Непроливаемая дорожная поилка с чистой водой доступна для питомца на протяжении всего маршрута.
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#E8EAEE] rounded-2xl text-[11px] text-[#596170]">
            <span className="font-bold text-[#2a221c]">Стандарт качества Брест:</span> Влажная дезинфекция гипоаллергенными ветеринарными составами после каждой поездки.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-[#7A1F3D] text-white text-xs font-bold rounded-xl shadow-md"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
