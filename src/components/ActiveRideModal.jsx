import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Thermometer,
  X,
} from 'lucide-react';
import { MOCK_DRIVER } from '../data/mockData.js';

export function ActiveRideModal({
  isOpen,
  onClose,
  pickup,
  destination,
  pet,
  tariff,
  price,
}) {
  const [stage, setStage] = useState('searching');
  const [etaMinutes, setEtaMinutes] = useState(3);
  const [cabinTemp, setCabinTemp] = useState(19.2);
  const [chatMessages, setChatMessages] = useState([
    'Здравствуйте! Подъезжаю на ул. Советскую. В салоне 19°C, защитный гамак готов.',
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage('searching');
      setEtaMinutes(3);
      return;
    }

    const t1 = setTimeout(() => {
      setStage('assigned');
    }, 1800);

    const t2 = setTimeout(() => {
      setStage('arriving');
    }, 5000);

    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
      setCabinTemp((prev) => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [...prev, `Вы: ${newMsg.trim()}`]);
    setNewMsg('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        'Водитель Александр: Принято, ожидаю у входа.',
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {stage === 'searching'
                ? 'Ищем зоо-водителя в Бресте...'
                : stage === 'assigned'
                ? 'Водитель назначен!'
                : 'ЗооТакси в пути'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {stage === 'searching' ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-[#c2652a]/15 flex items-center justify-center animate-pulse">
                <span className="text-3xl">🐾</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-[#c2652a] border-t-transparent animate-spin" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2a221c] mb-1">
              Подбираем автомобиль с климат-боксом
            </h3>
            <p className="text-xs text-[#7d6e61] max-w-xs">
              Проверяем наличие гамака и санитарной обработки для пассажира {pet?.name} ({pet?.breed}).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ETA banner */}
            <div className="bg-[#c2652a] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  🚗
                </div>
                <div>
                  <div className="text-xs font-medium text-white/80">Подача в Бресте</div>
                  <div className="text-lg font-bold">~ {etaMinutes} мин к вам</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {tariff?.title}
                </span>
                <div className="text-xs font-bold mt-1">{price?.toFixed(2)} Br</div>
              </div>
            </div>

            {/* Driver Profile Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#e5d9c9] shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={MOCK_DRIVER.photoUrl}
                  alt={MOCK_DRIVER.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#c2652a]/20"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2a221c] truncate">
                      {MOCK_DRIVER.name}
                    </span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      ★ {MOCK_DRIVER.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#6e5f52] mt-0.5">{MOCK_DRIVER.carModel}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#efe7db] text-[#4a3e35] font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                      {MOCK_DRIVER.licensePlate}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Вет-первая помощь
                    </span>
                  </div>
                </div>
              </div>

              {/* Call & Chat Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#f4ecdf]">
                <a
                  href={`tel:${MOCK_DRIVER.phone}`}
                  className="py-2.5 rounded-xl bg-[#efe7db] hover:bg-[#e4d8c7] text-[#4a3e35] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c2652a]" />
                  <span>Позвонить</span>
                </a>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="py-2.5 rounded-xl bg-[#efe7db] hover:bg-[#e4d8c7] text-[#4a3e35] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#c2652a]" />
                  <span>Чат ({chatMessages.length})</span>
                </button>
              </div>
            </div>

            {/* Chat Drawer if opened */}
            {showChat && (
              <div className="bg-white p-3 rounded-2xl border border-[#ded1bf]">
                <div className="text-xs font-bold text-[#2a221c] mb-2">Чат с водителем</div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl ${
                        msg.startsWith('Вы:')
                          ? 'bg-[#c2652a]/10 text-[#2a221c] ml-4'
                          : 'bg-[#faf5ee] text-[#55473c] mr-4'
                      }`}
                    >
                      {msg}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Написать водителю..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#faf5ee] border border-[#ded1bf] text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#c2652a] text-white text-xs font-semibold rounded-xl"
                  >
                    Отправить
                  </button>
                </form>
              </div>
            )}

            {/* Live In-Cabin Telemetry */}
            <div className="bg-[#f5efe6] p-3 rounded-2xl border border-[#ded1bf]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2a221c] flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#c2652a]" />
                  <span>Телеметрия салона для {pet?.name}</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  В норме
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-xl">
                  <div className="text-[10px] text-[#7d6e61]">Температура</div>
                  <div className="text-sm font-extrabold text-[#c2652a]">{cabinTemp}°C</div>
                </div>
                <div className="bg-white p-2 rounded-xl">
                  <div className="text-[10px] text-[#7d6e61]">Обдув</div>
                  <div className="text-sm font-extrabold text-emerald-700">Мягкий</div>
                </div>
                <div className="bg-white p-2 rounded-xl">
                  <div className="text-[10px] text-[#7d6e61]">Гамак</div>
                  <div className="text-sm font-extrabold text-sky-700">Натянут</div>
                </div>
              </div>
            </div>

            {/* Route summary */}
            <div className="text-xs text-[#6e5f52] bg-white p-3 rounded-2xl border border-[#e5d9c9] space-y-1">
              <div>
                <span className="font-semibold text-[#2a221c]">Подача: </span>
                {pickup}
              </div>
              <div>
                <span className="font-semibold text-[#2a221c]">Назначение: </span>
                {destination}
              </div>
            </div>

            {/* Cancel & Finish triggers */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert('Заказ отменен без комиссии.');
                  onClose();
                }}
                className="flex-1 py-3 bg-[#eee4d6] hover:bg-[#e4d8c7] text-[#5c4e42] text-xs font-semibold rounded-xl"
              >
                Отменить поездку
              </button>
              <button
                onClick={() => {
                  alert(`Поездка успешно завершена! Чек на сумму ${price?.toFixed(2)} Br отправлен.`);
                  onClose();
                }}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Завершить поездку
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
