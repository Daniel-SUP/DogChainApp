import React from 'react';
import { Car, FileText, PawPrint, User } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'rides',
      label: 'Поездки',
      icon: Car,
    },
    {
      id: 'activity',
      label: 'Чеки',
      icon: FileText,
    },
    {
      id: 'pets',
      label: 'Питомцы',
      icon: PawPrint,
    },
    {
      id: 'account',
      label: 'Профиль',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 sm:bottom-4 max-w-md mx-auto z-50 transform-gpu pointer-events-none select-none">
      {/* Liquid Glass Capsule Container */}
      <div className="pointer-events-auto relative overflow-hidden rounded-[26px] bg-[#F4F5F7]/65 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(42,34,28,0.15),0_2px_8px_rgba(42,34,28,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] px-2 py-1.5 grid grid-cols-4 items-center">
        {/* Subtle Liquid Light Sheen along the top edge */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 group cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-b from-white/90 to-white/40 shadow-[0_2px_10px_rgba(122,31,61,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/80'
                  : 'hover:bg-white/30'
              }`}
            >
              {/* Active ambient glow droplet */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-[#7A1F3D]/8 blur-sm pointer-events-none" />
              )}

              <div
                className={`relative transition-all duration-200 ${
                  isActive
                    ? 'text-[#7A1F3D] scale-105'
                    : 'text-[#5C6472] group-hover:text-[#2a221c]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>

              <span
                className={`relative text-[10px] tracking-tight transition-colors whitespace-nowrap mt-0.5 ${
                  isActive
                    ? 'font-extrabold text-[#7A1F3D]'
                    : 'font-semibold text-[#5C6472] group-hover:text-[#2a221c]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
