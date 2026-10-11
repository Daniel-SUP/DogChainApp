import React, { useEffect, useState } from 'react';
import {
  Phone, MessageSquare, ShieldCheck, Thermometer, X, Star, CheckCircle2, Receipt,
} from 'lucide-react';
import { MOCK_DRIVER } from '../data/mockData.js';

const initialChat = ['Здравствуйте! Подъезжаю. Скоро буду у места подачи.'];

export function ActiveRideModal({
  isOpen, onClose, onCompleteRide, onRateRide, onViewReceipt,
  pickup, destination, pet, tariff, price, paymentMethod,
}) {
  const [stage, setStage] = useState('searching');
  const [etaSeconds, setEtaSeconds] = useState(5);
  const [cabinTemp, setCabinTemp] = useState(19.2);
  const [chatMessages, setChatMessages] = useState(initialChat);
  const [newMsg, setNewMsg] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [rating, setRating] = useState(0);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStage('searching');
      setEtaSeconds(5);
      setChatMessages(initialChat);
      setShowChat(false);
      setRating(0);
      setReceiptOrder(null);
      return undefined;
    }

    setStage('searching');
    setEtaSeconds(5);
    setRating(0);
    setReceiptOrder(null);
    const assignedTimer = setTimeout(() => setStage('assigned'), 1200);
    const arrivedTimer = setTimeout(() => {
      setStage('arrived');
      setEtaSeconds(0);
      setChatMessages((messages) => [...messages, 'Водитель приехал и ожидает у места подачи.']);
    }, 5200);
    const etaTimer = setInterval(() => setEtaSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    const tempTimer = setInterval(() => setCabinTemp((temp) => +(temp + (Math.random() * 0.2 - 0.1)).toFixed(1)), 3000);
    return () => {
      clearTimeout(assignedTimer);
      clearTimeout(arrivedTimer);
      clearInterval(etaTimer);
      clearInterval(tempTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (stage !== 'riding') return undefined;
    const timer = setTimeout(async () => {
      const completedRide = {
        pickup,
        destination,
        petName: pet?.name || 'Питомец',
        petBreed: pet?.breed || '',
        tariffTitle: tariff?.title || 'Поездка с питомцем',
        priceByn: Number(price) || 0,
        paymentMethod: paymentMethod || 'Наличные водителю',
        date: new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(new Date()),
        createdAt: new Date().toISOString(),
        rating: null,
      };
      setIsSaving(true);
      try {
        const savedRide = await onCompleteRide?.(completedRide);
        setReceiptOrder(savedRide || completedRide);
      } finally {
        setIsSaving(false);
        setStage('rating');
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [stage]);

  if (!isOpen) return null;

  const sendChat = (event) => {
    event.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((messages) => [...messages, `Вы: ${newMsg.trim()}`]);
    setNewMsg('');
    setTimeout(() => setChatMessages((messages) => [...messages, 'Водитель Александр: Принято, ожидаю у входа.']), 800);
  };

  const submitRating = async (score) => {
    setRating(score);
    setIsSaving(true);
    try {
      const updatedRide = { ...receiptOrder, rating: score || null };
      const savedRide = await onRateRide?.(updatedRide);
      setReceiptOrder(savedRide || updatedRide);
      setStage('receipt');
    } finally {
      setIsSaving(false);
    }
  };

  const title = {
    searching: 'Ищем зоо-водителя в Бресте…',
    assigned: 'Водитель назначен!',
    arrived: 'Водитель приехал',
    riding: 'Поездка началась',
    rating: 'Поездка завершена',
    receipt: 'Спасибо за поездку!',
  }[stage];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#faf5ee] w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 border border-[#ded1bf] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5d9c9] mb-4">
          <h2 className="font-serif text-xl font-bold text-[#2a221c]">{title}</h2>
          <button onClick={onClose} aria-label="Закрыть" className="w-8 h-8 rounded-full bg-[#eee4d6] flex items-center justify-center text-[#55473c] hover:bg-[#e2d5c3]"><X className="w-4 h-4" /></button>
        </div>

        {stage === 'searching' && <div className="py-12 flex flex-col items-center text-center"><div className="relative mb-6"><div className="w-20 h-20 rounded-full bg-[#c2652a]/15 flex items-center justify-center animate-pulse"><span className="text-3xl">🐾</span></div><div className="absolute inset-0 rounded-full border-2 border-[#c2652a] border-t-transparent animate-spin" /></div><h3 className="font-serif text-lg font-bold text-[#2a221c] mb-1">Подбираем автомобиль</h3><p className="text-xs text-[#7d6e61] max-w-xs">Ищем водителя для поездки с питомцем {pet?.name} ({pet?.breed}).</p></div>}

        {['assigned', 'arrived', 'riding'].includes(stage) && <div className="space-y-4">
          <div className="bg-[#c2652a] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md"><div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">🚗</div><div><div className="text-xs font-medium text-white/80">{stage === 'riding' ? 'В пути к месту назначения' : stage === 'arrived' ? 'Водитель на месте' : 'Подача в Бресте'}</div><div className="text-lg font-bold">{stage === 'riding' ? 'Поездка идёт' : stage === 'arrived' ? 'Ожидает вас' : `~ ${etaSeconds} сек. до подачи`}</div></div></div><div className="text-right"><span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">{tariff?.title}</span><div className="text-xs font-bold mt-1">{price?.toFixed(2)} Br</div></div></div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#e5d9c9] shadow-sm"><div className="flex items-center gap-3"><img src={MOCK_DRIVER.photoUrl} alt={MOCK_DRIVER.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#c2652a]/20" referrerPolicy="no-referrer"/><div className="flex-1 min-w-0"><div className="flex items-center justify-between"><span className="font-bold text-sm text-[#2a221c] truncate">{MOCK_DRIVER.name}</span><span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">★ {MOCK_DRIVER.rating}</span></div><p className="text-xs text-[#6e5f52] mt-0.5">{MOCK_DRIVER.carModel}</p><div className="flex items-center gap-2 mt-1"><span className="bg-[#efe7db] text-[#4a3e35] font-mono text-[11px] font-bold px-2 py-0.5 rounded">{MOCK_DRIVER.licensePlate}</span><span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><ShieldCheck className="w-3 h-3"/>Вет-первая помощь</span></div></div></div><div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#f4ecdf]"><a href={`tel:${MOCK_DRIVER.phone}`} className="py-2.5 rounded-xl bg-[#efe7db] text-[#4a3e35] text-xs font-bold flex items-center justify-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#c2652a]"/>Позвонить</a><button onClick={() => setShowChat((shown) => !shown)} className="py-2.5 rounded-xl bg-[#efe7db] text-[#4a3e35] text-xs font-bold flex items-center justify-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-[#c2652a]"/>Чат ({chatMessages.length})</button></div></div>

          {showChat && <div className="bg-white p-3 rounded-2xl border border-[#ded1bf]"><div className="text-xs font-bold mb-2">Чат с водителем</div><div className="space-y-1.5 max-h-36 overflow-y-auto mb-2 text-xs">{chatMessages.map((message, index) => <div key={index} className={`p-2 rounded-xl ${message.startsWith('Вы:') ? 'bg-[#c2652a]/10 ml-4' : 'bg-[#faf5ee] mr-4'}`}>{message}</div>)}</div><form onSubmit={sendChat} className="flex gap-2"><input value={newMsg} onChange={(event) => setNewMsg(event.target.value)} placeholder="Написать водителю…" className="flex-1 px-3 py-1.5 rounded-xl bg-[#faf5ee] border border-[#ded1bf] text-xs"/><button className="px-3 py-1.5 bg-[#c2652a] text-white text-xs font-semibold rounded-xl">Отправить</button></form></div>}

          <div className="bg-[#f5efe6] p-3 rounded-2xl border border-[#ded1bf]"><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-[#2a221c] flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-[#c2652a]"/>Температура в салоне</span><span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">В норме</span></div><div className="grid grid-cols-2 gap-2 text-center"><div className="bg-white p-2 rounded-xl"><div className="text-[10px] text-[#7d6e61]">Температура</div><div className="text-sm font-extrabold text-[#c2652a]">{cabinTemp}°C</div></div><div className="bg-white p-2 rounded-xl"><div className="text-[10px] text-[#7d6e61]">Обдув</div><div className="text-sm font-extrabold text-emerald-700">Мягкий</div></div></div></div>

          <div className="text-xs text-[#6e5f52] bg-white p-3 rounded-2xl border border-[#e5d9c9] space-y-1"><div><span className="font-semibold text-[#2a221c]">Подача: </span>{pickup}</div><div><span className="font-semibold text-[#2a221c]">Назначение: </span>{destination}</div></div>

          {stage === 'arrived' ? <div className="space-y-2"><p className="text-center text-sm font-semibold text-[#5c4e42]">Водитель приехал. Подтвердите, когда питомец будет в машине.</p><button onClick={() => { setChatMessages((messages) => [...messages, 'Посадка подтверждена. Поездка началась.']); setStage('riding'); }} className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md">Питомец погружен — начать поездку</button><button onClick={onClose} className="w-full py-2.5 bg-[#eee4d6] text-[#5c4e42] text-xs font-semibold rounded-xl">Отменить поездку</button></div> : stage === 'riding' ? <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800">Питомец в машине, поездка выполняется…</div> : <button onClick={onClose} className="w-full py-2.5 bg-[#eee4d6] text-[#5c4e42] text-xs font-semibold rounded-xl">Отменить поездку</button>}
        </div>}

        {stage === 'rating' && <div className="py-5 text-center"><CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-3"/><h3 className="font-serif text-lg font-bold text-[#2a221c]">Поездка завершена</h3><p className="mt-1 text-sm text-[#7d6e61]">Как прошла поездка с {pet?.name || 'питомцем'}?</p><div className="flex justify-center gap-2 my-5">{[1, 2, 3, 4, 5].map((score) => <button key={score} aria-label={`${score} из 5`} onClick={() => setRating(score)} className={`p-1 ${score <= rating ? 'text-amber-500' : 'text-[#d8c8b5]'}`}><Star className="w-8 h-8 fill-current"/></button>)}</div><div className="space-y-2"><button disabled={!rating || isSaving} onClick={() => submitRating(rating)} className="w-full py-3 bg-[#c2652a] text-white text-sm font-bold rounded-xl disabled:opacity-50">{isSaving ? 'Сохраняем…' : 'Оценить поездку'}</button><button disabled={isSaving} onClick={() => submitRating(0)} className="w-full py-2.5 text-xs text-[#7d6e61]">Пропустить</button></div></div>}

        {stage === 'receipt' && <div className="py-4"><div className="text-center mb-4"><CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-2"/><h3 className="font-serif text-lg font-bold text-[#2a221c]">Чек сохранён</h3><p className="text-xs text-[#7d6e61]">Его можно открыть в разделе «Чеки».</p></div><div className="bg-white rounded-2xl border border-[#e5d9c9] p-4 space-y-2 text-xs"><div className="flex justify-between"><span className="text-[#7d6e61]">Питомец</span><span className="font-semibold">{receiptOrder?.petName}</span></div><div className="flex justify-between"><span className="text-[#7d6e61]">Маршрут</span><span className="font-semibold text-right max-w-[65%]">{receiptOrder?.pickup} → {receiptOrder?.destination}</span></div><div className="flex justify-between"><span className="text-[#7d6e61]">Оплата</span><span className="font-semibold">{receiptOrder?.paymentMethod}</span></div><div className="border-t border-dashed border-[#ded1bf] pt-2 flex justify-between text-sm"><span className="font-bold">Итого</span><span className="font-extrabold text-[#c2652a]">{Number(receiptOrder?.priceByn || 0).toFixed(2)} Br</span></div></div><button onClick={() => { onViewReceipt?.(); onClose(); }} className="w-full mt-4 py-3 bg-[#c2652a] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2"><Receipt className="w-4 h-4"/>Открыть чек</button></div>}

        {isSaving && stage === 'riding' && <p className="text-center text-xs text-[#7d6e61]">Сохраняем заказ…</p>}
      </div>
    </div>
  );
}
