import React, { useState } from 'react';
import { X, CreditCard, Banknote, Plus, Check, Trash2 } from 'lucide-react';

export function PaymentModal({
  isOpen,
  onClose,
  paymentMethods,
  selectedPaymentId,
  onSelectPayment,
  onAddCard,
  onDeleteCard,
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [last4, setLast4] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardError, setCardError] = useState('');
  const [isSavingCard, setIsSavingCard] = useState(false);

  if (!isOpen) return null;

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setExpiry(val);
  };

  const handleAddNewCard = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(last4) || expiry.length < 5) {
      setCardError('Укажите последние четыре цифры и срок действия карты.');
      return;
    }
    setCardError('');
    setIsSavingCard(true);
    try {
      const savedCard = await onAddCard({ last4, expiry });
      onSelectPayment(savedCard.id);
      setIsAddingNew(false);
      setLast4('');
      setExpiry('');
    } catch (error) {
      setCardError(error.message || 'Не удалось сохранить карту.');
    } finally {
      setIsSavingCard(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F4F5F7] w-full max-w-md rounded-t-[28px] sm:rounded-3xl p-5 border border-[#D5D9DF] shadow-2xl max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE2E7] mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#7A1F3D]" />
            <h2 className="font-serif text-xl font-bold text-[#2a221c]">
              {isAddingNew ? 'Привязать новую карту' : 'Способы оплаты'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:bg-[#D9DDE3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAddingNew ? (
          <div>
            <div className="space-y-2.5 mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B929E]">
                Банковские карты
              </div>

              {paymentMethods
                .filter((m) => m.type === 'card')
                .map((m) => {
                  const isSelected = m.id === selectedPaymentId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectPayment(m.id);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white ring-2 ring-[#7A1F3D] shadow-sm'
                          : 'bg-white/80 hover:bg-white border border-[#E1E4E9]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2a221c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#2a221c]">{m.title}</div>
                          <div className="text-[11px] text-[#6B7280]">{m.subtitle}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {paymentMethods.filter((p) => p.type === 'card').length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCard(m.id).catch((error) => alert(error.message || 'Не удалось удалить карту.'));
                            }}
                            className="p-1.5 text-[#8B929E] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Удалить карту"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#7A1F3D] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-[#CBD0D8]" />
                        )}
                      </div>
                    </div>
                  );
                })}

              {paymentMethods.filter((method) => method.type === 'card').length === 0 && (
                <p className="rounded-xl border border-dashed border-[#CBD0D8] p-3 text-xs text-[#6B7280]">
                  Банковские карты ещё не добавлены.
                </p>
              )}

              {paymentMethods.filter((method) => method.type === 'card').length === 0 && (
                <p className="rounded-xl border border-dashed border-[#CBD0D8] p-3 text-xs text-[#6B7280]">
                  Карты не добавлены.
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#7A1F3D]/40 text-[#7A1F3D] hover:bg-[#7A1F3D]/5 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Привязать карту (Белкарт / МИР / Visa / MC)</span>
              </button>
            </div>

            {/* Cash Section */}
            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B929E]">
                Наличный расчет
              </div>

              {paymentMethods
                .filter((m) => m.type === 'cash')
                .map((m) => {
                  const isSelected = m.id === selectedPaymentId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectPayment(m.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white ring-2 ring-[#7A1F3D] shadow-sm'
                          : 'bg-white/80 hover:bg-white border border-[#E1E4E9]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#2a221c]">{m.title}</div>
                          <div className="text-[11px] text-[#6B7280]">{m.subtitle}</div>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#7A1F3D] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-[#CBD0D8]" />
                      )}
                    </div>
                  );
                })}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#7A1F3D] text-white text-xs font-bold rounded-xl shadow-md"
            >
              Подтвердить выбор
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddNewCard} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                Последние 4 цифры карты
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  placeholder="0000"
                  value={last4}
                  onChange={(event) => setLast4(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5D9DF] text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#7A1F3D]"
                />
                <CreditCard className="w-4 h-4 absolute right-3.5 top-3 text-[#8B929E]" />
              </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                  Срок действия (ММ/ГГ)
                </label>
                <input
                  type="text"
                  required
                  placeholder="12/28"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5D9DF] text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#7A1F3D]"
                />
            </div>

            <div className="p-2.5 bg-[#E9EBEF] rounded-xl text-[11px] text-[#596170]">
              Демо-режим: сохраняются только последние 4 цифры и срок действия. Реальные платежи не подключены.
            </div>
            {cardError && <p role="alert" className="text-xs text-red-700">{cardError}</p>}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#E5E7EB] text-[#4B5563] font-semibold text-xs"
              >
                Назад
              </button>
              <button
                type="submit"
                disabled={isSavingCard}
                className="flex-1 py-2.5 rounded-xl bg-[#7A1F3D] text-white font-semibold text-xs shadow-md disabled:opacity-60"
              >
                {isSavingCard ? 'Сохраняем…' : 'Сохранить карту'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
