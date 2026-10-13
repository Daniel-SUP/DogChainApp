import React from 'react';
import { Clock, Receipt, Star } from 'lucide-react';

export function ActivityTab({ rides = [], error = '' }) {
  return (
    <div className="px-4 py-4 max-w-md mx-auto pb-24">
      <div className="mb-4"><h1 className="font-serif text-2xl font-bold text-[#2a221c]">Чеки и поездки</h1><p className="text-xs text-[#6B7280]">Ваши завершённые заказы</p></div>
      {error && <p role="alert" className="mb-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">{error}</p>}
      {rides.length === 0 ? <div className="rounded-2xl border border-dashed border-[#CBD0D8] bg-white/60 p-6 text-center"><Clock className="w-8 h-8 mx-auto mb-2 text-[#7A1F3D]"/><p className="text-sm font-semibold text-[#4B5563]">Заказов пока нет</p><p className="mt-1 text-xs text-[#6B7280]">Здесь появятся история поездок и чеки.</p></div> : (
        <div className="space-y-3">{rides.map((ride) => <article key={ride.id} className="bg-white rounded-2xl p-4 border border-[#DFE2E7] shadow-sm">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-dashed border-[#DFE2E7]"><div><div className="flex items-center gap-1.5 text-xs font-bold text-[#2a221c]"><Receipt className="w-4 h-4 text-[#7A1F3D]"/>Чек №{ride.id}</div><p className="mt-1 text-[11px] text-[#6B7280]">{ride.date || (ride.createdAt ? new Date(ride.createdAt).toLocaleString('ru-RU') : '')}</p></div><div className="text-sm font-extrabold text-[#7A1F3D]">{Number(ride.priceByn || 0).toFixed(2)} Br</div></div>
          <div className="space-y-1.5 py-3 text-xs"><p><span className="font-semibold text-[#2a221c]">Питомец: </span><span className="text-[#596170]">{ride.petName || 'Питомец'}{ride.petBreed ? ` · ${ride.petBreed}` : ''}</span></p><p><span className="font-semibold text-[#2a221c]">Маршрут: </span><span className="text-[#596170]">{ride.pickup || '—'} → {ride.destination || '—'}</span></p><p><span className="font-semibold text-[#2a221c]">Тариф: </span><span className="text-[#596170]">{ride.tariffTitle || '—'}</span></p><p><span className="font-semibold text-[#2a221c]">Оплата: </span><span className="text-[#596170]">{ride.paymentMethod || 'Наличные водителю'}</span></p></div>
          <div className="flex items-center justify-between border-t border-[#EEF0F3] pt-2 text-xs"><span className="text-[#6B7280]">{ride.status === 'completed' || ride.dbId ? 'Поездка завершена' : 'Демо-поездка'}</span>{ride.rating ? <span className="inline-flex items-center gap-1 font-bold text-amber-600"><Star className="w-3.5 h-3.5 fill-current"/>{ride.rating}/5</span> : <span className="text-[#8B929E]">Без оценки</span>}</div>
        </article>)}</div>
      )}
    </div>
  );
}
