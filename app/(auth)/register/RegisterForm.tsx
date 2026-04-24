'use client';

import { useRouter } from 'next/navigation';
import { registerAction } from '../actions';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await registerAction({} as any, formData);

    setIsPending(false);
    if (result?.success) {
      toast.success(result.message || 'Pendaftaran berhasil!');
      router.push('/dashboard');
    } else {
      if (result?.errors) setErrors(result.errors);
      if (result?.message) toast.error(result.message);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name[0]}
            </p>
          )}
        </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
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

        <div className="flex items-start gap-3">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            required
            className="w-5 h-5 border border-gray-300 rounded mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="agreeTerms" className="text-sm md:text-xs text-gray-700">
            Saya setuju dengan{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
              Syarat dan Ketentuan
            </Link>{' '}
            dan{' '}
            <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
              Kebijakan Privasi
            </Link>
          </label>
        </div>
        {errors?.agreeTerms && (
          <p className="text-red-500 text-sm">
            {errors.agreeTerms[0]}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 md:py-2.5 rounded-lg transition duration-200"
        >
          {isPending ? 'Sedang daftar...' : 'Daftar'}
        </button>
      </form>

      <div className="mt-6 md:mt-5 text-center text-sm md:text-xs">
        <p className="text-gray-600">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
