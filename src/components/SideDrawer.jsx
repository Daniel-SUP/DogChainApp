import React from 'react';
import { X, ShieldCheck, MapPin, Phone, Heart, FileText, Settings, ExternalLink } from 'lucide-react';

export function SideDrawer({ isOpen, onClose, onSelectTab }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-xs bg-[#faf5ee] h-full shadow-2xl z-10 flex flex-col justify-between p-5 border-r border-[#ded1bf]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e5d9c9] mb-5">
            <div>
              <div className="font-serif text-2xl font-bold text-[#c2652a]">DogChain</div>
              <div className="text-xs text-[#7d6e61]">Сервис ЗооТакси · Брест</div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <button
              onClick={() => {
                onSelectTab('rides');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-bold text-[#2a221c] hover:bg-[#efe6d8] transition-colors"
            >
              <span className="text-base">🚗</span>
              <span>Заказ поездки</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('activity');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-bold text-[#2a221c] hover:bg-[#efe6d8] transition-colors"
            >
              <FileText className="w-4 h-4 text-[#c2652a]" />
              <span>История и чеки</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('pets');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-bold text-[#2a221c] hover:bg-[#efe6d8] transition-colors"
            >
              <span className="text-base">🐾</span>
              <span>Мои питомцы</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('account');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-bold text-[#2a221c] hover:bg-[#efe6d8] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Стандарты и профиль</span>
            </button>
          </div>

          {/* Brest Info Box */}
          <div className="mt-6 p-3.5 bg-white rounded-2xl border border-[#e5d9c9] text-xs text-[#5c4e42] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#2a221c]">
              <MapPin className="w-3.5 h-3.5 text-[#c2652a]" />
              <span>Зона покрытия:</span>
            </div>
            <div>г. Брест (все микрорайоны: Центр, Восток, Ковалево, Юго-Запад, Речица, Граевка) и Брестский район.</div>
          </div>
        </div>

        {/* Footer Emergency Call */}
        <div className="pt-4 border-t border-[#e5d9c9]">
          <div className="text-[11px] text-[#7d6e61] mb-1.5">
            Горячая линия поддержки в Бресте:
          </div>
          <a
            href="tel:+375162550055"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#efe6d8] text-[#2a221c] font-bold text-xs rounded-xl hover:bg-[#e4d8c7]"
          >
            <Phone className="w-3.5 h-3.5 text-[#c2652a]" />
            <span>+375 (162) 55-00-55</span>
          </a>
        </div>
      </div>
    </div>
  );
}
