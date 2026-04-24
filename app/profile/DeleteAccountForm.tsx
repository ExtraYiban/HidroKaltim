'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { deleteProfileAction, logoutAction } from '@/app/(auth)/actions';

interface DeleteAccountFormProps {
  user: {
    email: string;
  };
}

export function DeleteAccountForm({ user }: DeleteAccountFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleDeleteClick = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    if (confirmEmail !== user.email) {
      toast.error('Email tidak sesuai');
      return;
    }

    setShowConfirmation(false);
    submitDelete();
  };

  const submitDelete = async () => {
    const form = document.getElementById('delete-form') as HTMLFormElement;
    if (!form) return;

    setIsPending(true);
    setErrors({});

    const formData = new FormData(form);
    const result = await deleteProfileAction(
      { success: false, message: '', errors: {} },
      formData
    );

    setIsPending(false);
    if (result?.success) {
      toast.success(result.message || 'Akun berhasil dihapus');
      setTimeout(() => logoutAction(), 1000);
    } else {
      if (result?.errors) setErrors(result.errors);
      if (result?.message) toast.error(result.message);
    }
  };

  return (
    <>
      {!showConfirmation ? (
        <div>
          <p className="text-red-700 text-sm md:text-base mb-4">
            Menghapus akun Anda akan menghapus semua data profil dan tidak dapat dibatalkan. Pastikan Anda yakin sebelum melanjutkan.
          </p>
          <button
            onClick={handleDeleteClick}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 md:py-2.5 px-6 rounded-lg transition duration-200"
          >
            Hapus Akun Saya
          </button>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6 bg-red-100 border border-red-300 rounded-lg">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-red-600 mb-2">
              Konfirmasi Penghapusan Akun
            </h3>
            <p className="text-red-700 text-sm md:text-base">
              Ini adalah tindakan terakhir. Pastikan Anda ingin menghapus akun secara permanen.
            </p>
          </div>

          <form id="delete-form" className="space-y-4 md:space-y-5">
            <div>
              <label htmlFor="email-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                Ketik email Anda untuk mengkonfirmasi: <span className="font-mono text-red-600">{user.email}</span>
              </label>
              <input
                id="email-confirm"
                name="email"
                type="email"
                placeholder={user.email}
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                className="w-full px-4 py-3 md:py-2.5 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-base md:text-sm"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                Masukkan password Anda
              </label>
              <input
                id="password-confirm"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 md:py-2.5 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-base md:text-sm"
              />
              {errors?.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmEmail('');
                }}
                disabled={isPending}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-400 text-gray-800 font-semibold py-3 md:py-2.5 rounded-lg transition duration-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isPending || confirmEmail !== user.email}
                className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 md:py-2.5 px-6 rounded-lg transition duration-200"
              >
                {isPending ? 'Sedang menghapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
