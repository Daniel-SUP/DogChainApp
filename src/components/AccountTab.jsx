import React from 'react';
import {
  CreditCard,
  Banknote,
  PhoneCall,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function AccountTab({
  user,
  onLogout,
  paymentMethods = [],
  selectedPaymentId,
  onOpenPaymentModal,
  selectedRegion = 'Брест, Центр',
}) {
  const brestEmergencyVets = [
    {
      name: 'Дежурная ветслужба Бреста (Круглосуточно)',
      phone: '+375 (162) 55-00-55',
      address: 'ул. Московская, 326',
    },
    {
      name: 'Ветклиника «ВетМедСервис» (Скорая помощь)',
      phone: '+375 (29) 720-11-22',
      address: 'ул. Гоголя, 71',
    },
  ];

  return (
    <div className="px-4 py-4 max-w-md mx-auto pb-24">      <div className="bg-white rounded-3xl p-4 border border-[#DFE2E7] shadow-sm mb-4 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-[#E8EAEE] text-[#7A1F3D] font-serif text-2xl font-bold flex items-center justify-center">
          {user?.name?.slice(0, 1)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base text-[#2a221c]">{user?.name}</h2>
          <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
          <div className="text-[11px] text-[#7A1F3D] font-semibold mt-1">{selectedRegion}</div>
        </div>
        <button onClick={onLogout} className="text-xs font-semibold text-[#7A1F3D]">Выйти</button>
      </div>

      {/* Payment methods section with working modal open */}
      <div className="bg-white rounded-3xl p-4 border border-[#DFE2E7] shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-serif text-base font-bold text-[#2a221c]">
            Способы оплаты
          </span>
          <button
            onClick={onOpenPaymentModal}
            className="text-xs font-semibold text-[#7A1F3D] hover:underline cursor-pointer"
          >
            Управление / + Карта
          </button>
        </div>

        <div className="space-y-2">
          {paymentMethods.map((m) => {
            const isSelected = m.id === selectedPaymentId;
            return (
              <div
                key={m.id}
                onClick={onOpenPaymentModal}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F5F6F8] border border-[#7A1F3D]'
                    : 'bg-white border border-[#E5E7EB] hover:bg-[#F5F6F8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      m.type === 'cash'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#2a221c] text-white'
                    }`}
                  >
                    {m.type === 'cash' ? (
                      <Banknote className="w-4 h-4" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2a221c]">{m.title}</div>
                    <div className="text-[11px] text-[#6B7280]">{m.subtitle}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Выбрано
                  </span>
                )}
              </div>
            );
          })}
          {paymentMethods.filter((method) => method.type === 'card').length === 0 && (
            <p className="rounded-xl border border-dashed border-[#CBD0D8] p-3 text-xs text-[#6B7280]">
              Банковские карты ещё не добавлены.
            </p>
          )}
        </div>
      </div>

      {/* Emergency Vet Contacts in Brest */}
      <div className="bg-white rounded-3xl p-4 border border-[#DFE2E7] shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <PhoneCall className="w-4 h-4 text-[#7A1F3D]" />
          <span className="font-serif text-base font-bold text-[#2a221c]">
            Круглосуточная ветпомощь в Бресте
          </span>
        </div>

        <div className="space-y-2">
          {brestEmergencyVets.map((v, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-[#F5F6F8] border border-[#E5E7EB] flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-[#2a221c]">{v.name}</div>
                <div className="text-[11px] text-[#6B7280]">{v.address}</div>
              </div>
              <a
                href={`tel:${v.phone}`}
                className="px-3 py-1.5 bg-[#7A1F3D] text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm"
              >
                Вызов
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Safety standards */}
      <div className="bg-gradient-to-br from-[#ECEEF2] to-[#E3E6EB] rounded-3xl p-4 border border-[#D5D9DF]">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-[#7A1F3D]" />
          <span className="font-serif text-base font-bold text-[#2a221c]">
            Стандарты DogChain в Беларуси
          </span>
        </div>
        <ul className="text-xs text-[#4B5563] space-y-1.5 list-disc list-inside">
          <li>Водители обучены оказанию доврачебной зоо-помощи</li>
          <li>Обработка салона дезинфектором безопасным для лап</li>
          <li>Перевозка только одного клиента с питомцем (без подсадки)</li>
          <li>Автомобили застрахованы для перевозки домашних животных</li>
        </ul>
      </div>
    </div>
  );
}
