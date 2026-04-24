'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updatePasswordAction } from '@/app/(auth)/actions';

export function UpdatePasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await updatePasswordAction(
      { success: false, message: '', errors: {} },
      formData
    );

    setIsPending(false);
    if (result?.success) {
      toast.success(result.message || 'Password berhasil diperbarui');
      setIsSuccess(true);
      e.currentTarget.reset();
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      if (result?.errors) setErrors(result.errors);
      if (result?.message) toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password Saat Ini
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
        />
        {errors?.currentPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.currentPassword[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password Baru
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
        />
        {errors?.newPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.newPassword[0]}
          </p>
        )}
        <p className="text-gray-500 text-xs md:text-xs mt-1">
          Min. 8 karakter, kombinasi huruf besar, kecil, dan angka
        </p>
      </div>

      <div>
        <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
          Konfirmasi Password Baru
        </label>
        <input
          id="newPasswordConfirm"
          name="newPasswordConfirm"
          type="password"
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base md:text-sm"
        />
        {errors?.newPasswordConfirm && (
          <p className="text-red-500 text-sm mt-1">
            {errors.newPasswordConfirm[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || isSuccess}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 md:py-2.5 rounded-lg transition duration-200"
      >
        {isPending ? 'Sedang mengubah...' : isSuccess ? '✓ Berhasil diubah' : 'Ubah Password'}
      </button>
    </form>
  );
}
