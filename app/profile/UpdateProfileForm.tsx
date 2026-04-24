'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateProfileAction } from '@/app/(auth)/actions';

interface UpdateProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(
      { success: false, message: '', errors: {} },
      formData
    );

    setIsPending(false);
    if (result?.success) {
      toast.success(result.message || 'Profil berhasil diperbarui');
      // Optionally reload page or update UI
      setTimeout(() => window.location.reload(), 1000);
    } else {
      if (result?.errors) setErrors(result.errors);
      if (result?.message) toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
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
          defaultValue={user.email}
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
        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}
