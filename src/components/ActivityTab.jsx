import React from 'react';
import { PAST_RIDES } from '../data/mockData.js';
import { Clock, MapPin, Receipt, RotateCw, CheckCircle2 } from 'lucide-react';

export function ActivityTab({ onReorderRide }) {
  return (
    <div className="px-4 py-4 max-w-md mx-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2a221c]">
            История поездок
          </h1>
          <p className="text-xs text-[#7d6e61]">Брест, Республика Беларусь</p>
        </div>
        <span className="text-xs font-semibold text-[#c2652a] bg-[#c2652a]/10 px-2.5 py-1 rounded-full">
          {PAST_RIDES.length} поездки
        </span>
      </div>

      <div className="space-y-4">
        {PAST_RIDES.map((ride) => (
          <div
            key={ride.id}
            className="bg-white rounded-2xl p-4 border border-[#e5d9c9] shadow-sm hover:shadow-md transition-all"
          >
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f4ecdf] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-[#2a221c]">{ride.date}</span>
                <span className="text-[11px] text-[#9c8d7f]">· {ride.tariffTitle}</span>
              </div>
              <div className="text-sm font-extrabold text-[#c2652a]">
                {ride.priceByn.toFixed(2)} Br
              </div>
            </div>

            {/* Route points */}
            <div className="space-y-2 mb-3 text-xs">
              <div className="flex items-start gap-2 text-[#4a3e35]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span className="truncate">{ride.pickup}</span>
              </div>
              <div className="flex items-start gap-2 text-[#4a3e35]">
                <span className="w-2 h-2 rounded-full bg-[#c2652a] mt-1 shrink-0" />
                <span className="truncate">{ride.destination}</span>
              </div>
            </div>

            {/* Pet & Driver bar */}
            <div className="bg-[#faf6f0] p-2.5 rounded-xl border border-[#eee4d6] flex items-center justify-between text-xs text-[#6e5f52] mb-3">
              <div className="flex items-center gap-1.5 truncate">
                <span>🐾</span>
                <span className="font-semibold text-[#2a221c]">{ride.petName}</span>
                <span className="text-[11px] text-[#9c8d7f]">({ride.petBreed})</span>
              </div>
              <div className="text-[11px] font-medium text-[#7d6e61]">
                {ride.carModel}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  alert(`Электронный чек по поездке ${ride.id} на сумму ${ride.priceByn} Br отправлен на ваш e-mail.`)
                }
                className="flex-1 py-2 rounded-xl bg-[#faf5ee] hover:bg-[#efe6d8] text-[#5c4e42] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Чек</span>
              </button>
              <button
                onClick={() => onReorderRide(ride)}
                className="flex-1 py-2 rounded-xl bg-[#c2652a] hover:bg-[#b05820] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Повторить</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
