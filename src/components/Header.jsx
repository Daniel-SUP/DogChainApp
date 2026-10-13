import React from 'react';
import { Shield, MapPin, ChevronDown } from 'lucide-react';

export function Header({
  onOpenClimateInfo,
  onOpenPetProfile,
  onOpenRegionSelector,
  activePet,
  cityArea = 'г. Брест',
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#F4F5F7]/95 backdrop-blur-md border-b border-[#E1E4E9] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Brand & City */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#7A1F3D]">
              DogChain
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B929E] bg-[#E8EAEE] px-1.5 py-0.5 rounded">
              BY
            </span>
          </div>

          {/* Clickable Region Selector */}
          <button
            onClick={onOpenRegionSelector}
            className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#7A1F3D] transition-colors group cursor-pointer"
            title="Выбрать город"
          >
            <MapPin className="w-3 h-3 text-[#7A1F3D]" />
            <span className="font-medium underline decoration-dotted underline-offset-2">
              {cityArea}
            </span>
            <ChevronDown className="w-3 h-3 text-[#8B929E] group-hover:text-[#7A1F3D] transition-transform" />
          </button>
        </div>

        {/* Right: ClimateGuard and Pet Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* ClimateGuard Badge */}
          <button
            onClick={onOpenClimateInfo}
            className="flex items-center gap-1.5 bg-[#E8EAEE] hover:bg-[#DFE2E7] text-[#4B5563] px-3 py-1.5 rounded-full text-xs font-medium border border-[#D5D9DF] transition-all cursor-pointer"
            title="Система климат-контроля для животных"
          >
            <Shield className="w-3.5 h-3.5 text-[#7A1F3D]" />
            <span className="hidden xs:inline">Климат-Контроль</span>
            <span className="xs:hidden">Климат</span>
          </button>

          {/* Active Pet Avatar Button */}
          <button
            onClick={onOpenPetProfile}
            className="relative w-10 h-10 rounded-full ring-2 ring-[#7A1F3D]/40 hover:ring-[#7A1F3D] overflow-hidden transition-all bg-[#E8EAEE] cursor-pointer"
            title={`Профиль питомца: ${activePet?.name}`}
          >
            <img
              src={activePet?.photoUrl}
              alt={activePet?.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 bg-[#7A1F3D] text-white text-[9px] p-0.5 rounded-full leading-none">
              🐾
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
