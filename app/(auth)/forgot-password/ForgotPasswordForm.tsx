'use client';

import { requestPasswordResetAction } from '../actions';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordResetAction({} as any, formData);

    setIsPending(false);
    if (result?.success) {
      toast.success(result.message || 'Email telah dikirim');
      setSubmitted(true);
    } else {
      if (result?.errors) setErrors(result.errors);
      if (result?.message) toast.error(result.message);
    }
  };

  if (submitted) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4">
            ✓
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Periksa Email Anda
          </h3>
          <p className="text-gray-600 text-sm">
            Jika email terdaftar di sistem kami, Anda akan menerima link reset password dalam beberapa menit.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block text-blue-600 hover:text-blue-700 font-semibold mt-6"
        >
          Kembali ke Masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nama@contoh.com"
            required
            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 md:py-2.5 rounded-lg transition duration-200"
        >
          {isPending ? 'Sedang mengirim...' : 'Kirim Link Reset'}
        </button>
      </form>

      <div className="mt-6 md:mt-5 text-center text-sm md:text-xs">
        <Link
          href="/login"
          className="text-gray-600 hover:text-gray-700"
        >
          Kembali ke Masuk
        </Link>
      </div>
    </div>
  );
}
