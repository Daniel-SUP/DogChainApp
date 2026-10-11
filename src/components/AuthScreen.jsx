import React, { useState } from 'react';

export function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registering = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (registering && password !== confirmation) {
      setError('Пароли не совпадают.');
      return;
    }
    if (registering && (password.length < 12 || password.length > 128)) {
      setError('Пароль должен содержать от 12 до 128 символов.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${registering ? 'register' : 'login'}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registering ? { name, email, password } : { email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Не удалось выполнить вход.');
      onAuthenticated(result.user);
    } catch (submitError) {
      setError(submitError.message || 'Не удалось связаться с сервером. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4ede3] flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl bg-[#faf5ee] p-6 shadow-xl border border-[#ded1bf]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c2652a] text-2xl text-white">🐾</div>
          <h1 className="font-serif text-2xl font-bold text-[#2a221c]">DogChain</h1>
          <p className="mt-1 text-sm text-[#7d6e61]">{registering ? 'Создайте аккаунт для своих питомцев' : 'Войдите в свой аккаунт'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {registering && (
            <label className="block text-sm font-medium text-[#5c4e42]">
              Имя
              <input
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#ded1bf] bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#c2652a]"
              />
            </label>
          )}

          <label className="block text-sm font-medium text-[#5c4e42]">
            Электронная почта
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#ded1bf] bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#c2652a]"
            />
          </label>

          <label className="block text-sm font-medium text-[#5c4e42]">
            Пароль
            <input
              type="password"
              autoComplete={registering ? 'new-password' : 'current-password'}
              required
              minLength={registering ? 12 : 1}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[#ded1bf] bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#c2652a]"
            />
            {registering && <span className="mt-1 block text-xs text-[#7d6e61]">От 12 до 128 символов.</span>}
          </label>

          {registering && (
            <label className="block text-sm font-medium text-[#5c4e42]">
              Повторите пароль
              <input
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#ded1bf] bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#c2652a]"
              />
            </label>
          )}

          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#c2652a] px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Подождите…' : registering ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#7d6e61]">
          {registering ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}{' '}
          <button
            type="button"
            onClick={() => { setMode(registering ? 'login' : 'register'); setError(''); }}
            className="font-semibold text-[#c2652a] hover:underline"
          >
            {registering ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>
      </section>
    </main>
  );
}
