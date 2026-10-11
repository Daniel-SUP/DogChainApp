import React from 'react';
import { Clock } from 'lucide-react';

export function ActivityTab() {
  return (
    <div className="px-4 py-4 max-w-md mx-auto pb-24">
      <div className="mb-4">
        <h1 className="font-serif text-2xl font-bold text-[#2a221c]">История поездок</h1>
        <p className="text-xs text-[#7d6e61]">Ваши завершённые заказы</p>
      </div>
      <div className="rounded-2xl border border-dashed border-[#d8c8b5] bg-white/60 p-6 text-center">
        <Clock className="w-8 h-8 mx-auto mb-2 text-[#c2652a]" />
        <p className="text-sm font-semibold text-[#5c4e42]">Заказов пока нет</p>
        <p className="mt-1 text-xs text-[#7d6e61]">Здесь появится история ваших поездок.</p>
      </div>
    </div>
  );
}
