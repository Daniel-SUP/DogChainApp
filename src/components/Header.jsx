import React from 'react';
import { Menu, Shield, MapPin, ChevronDown } from 'lucide-react';

export function Header({
  onOpenMenu,
  onOpenClimateInfo,
  onOpenPetProfile,
  onOpenRegionSelector,
  activePet,
  cityArea = 'Брест, Центр',
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#faf5ee]/95 backdrop-blur-md border-b border-[#e8ded2] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#55473c] hover:bg-[#efe6d8] transition-colors"
            aria-label="Меню"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#c2652a]">
                DogChain
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9a897b] bg-[#efe6d8] px-1.5 py-0.5 rounded">
                BY
              </span>
            </div>
            {/* Clickable Region Selector */}
            <button
              onClick={onOpenRegionSelector}
              className="flex items-center gap-1 text-xs text-[#7d6e61] hover:text-[#c2652a] transition-colors group cursor-pointer"
              title="Выбрать регион или микрорайон"
            >
              <MapPin className="w-3 h-3 text-[#c2652a]" />
              <span className="font-medium underline decoration-dotted underline-offset-2">
                {cityArea}
              </span>
              <ChevronDown className="w-3 h-3 text-[#9c8d7f] group-hover:text-[#c2652a] transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: ClimateGuard and Pet Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* ClimateGuard Badge */}
          <button
            onClick={onOpenClimateInfo}
            className="flex items-center gap-1.5 bg-[#efe6d8] hover:bg-[#e7dcce] text-[#55473c] px-3 py-1.5 rounded-full text-xs font-medium border border-[#ded1bf] transition-all"
            title="Система климат-контроля для животных"
          >
            <Shield className="w-3.5 h-3.5 text-[#c2652a]" />
            <span className="hidden xs:inline">Климат-Контроль</span>
            <span className="xs:hidden">Климат</span>
          </button>

          {/* Active Pet Avatar Button */}
          <button
            onClick={onOpenPetProfile}
            className="relative w-10 h-10 rounded-full ring-2 ring-[#c2652a]/40 hover:ring-[#c2652a] overflow-hidden transition-all bg-[#efe6d8]"
            title={`Профиль питомца: ${activePet?.name}`}
          >
            <img
              src={activePet?.photoUrl}
              alt={activePet?.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 bg-[#c2652a] text-white text-[9px] p-0.5 rounded-full leading-none">
              🐾
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
