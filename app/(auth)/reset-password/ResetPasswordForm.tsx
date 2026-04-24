'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordAction } from '../actions';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    if (!token || !email) {
      toast.error('Link reset password tidak valid');
      setIsPending(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('token', token);
    formData.append('email', email);

    const result = await resetPasswordAction({} as any, formData);

    setIsPending(false);
    if (result?.success) {
      toast.success(result.message || 'Password berhasil direset!');
      router.push('/login');
    } else {
      if (result?.errors) setErrors(result.errors);
      if (result?.message) toast.error(result.message);
    }
  };

  if (!token || !email) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-2xl mb-4">
            ✕
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Link Tidak Valid
          </h3>
          <p className="text-gray-600 text-sm">
            Link reset password Anda tidak valid atau sudah kadaluarsa.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block text-blue-600 hover:text-blue-700 font-semibold mt-6"
        >
          Minta Link Baru
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password Baru
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
          />
          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password[0]}
            </p>
          )}
          <p className="text-gray-500 text-xs md:text-xs mt-1">
            Min. 8 karakter, kombinasi huruf besar, kecil, dan angka
          </p>
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
            Konfirmasi Password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
          />
          {errors?.passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passwordConfirm[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 md:py-2.5 rounded-lg transition duration-200"
        >
          {isPending ? 'Sedang mereset...' : 'Reset Password'}
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

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="w-full text-center py-8">Memuat...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
