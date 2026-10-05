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
      label: 'Активность',
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf5ee]/95 backdrop-blur-md border-t border-[#ded1bf] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] text-center transition-all group"
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'text-[#c2652a] scale-110' : 'text-[#7d6e61] group-hover:text-[#2a221c]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight transition-colors whitespace-nowrap mt-0.5 ${
                  isActive ? 'font-bold text-[#c2652a]' : 'font-medium text-[#7d6e61]'
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
