import { getCurrentUser } from '@/lib/auth/session';
import { UpdateProfileForm } from './UpdateProfileForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { DeleteAccountForm } from './DeleteAccountForm';

export const metadata = {
  title: 'Profil Saya | HidroKaltim',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden min-h-screen bg-white py-6">
        <div className="px-4 space-y-6">
          {/* Profile Header */}
          <div className="text-center pb-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Profil Saya
            </h1>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>

          {/* Edit Profile Section */}
          <div className="pb-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Profil
            </h2>
            <UpdateProfileForm user={user} />
          </div>

          {/* Change Password Section */}
          <div className="pb-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ubah Password
            </h2>
            <UpdatePasswordForm />
          </div>

          {/* Delete Account Section */}
          <div className="pb-4">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Zona Berbahaya
            </h2>
            <DeleteAccountForm user={user} />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid min-h-screen bg-gray-50">
        <div className="grid grid-cols-12 gap-8 p-8">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Profil Saya
                </h1>
                <p className="text-gray-600 text-sm break-all">{user.email}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Role: {user.role === 'admin' ? 'Administrator' : 'Pengguna'}
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href="#edit-profile"
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                >
                  Edit Profil
                </a>
                <a
                  href="#change-password"
                  className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                >
                  Ubah Password
                </a>
                <a
                  href="#delete-account"
                  className="block px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
                >
                  Hapus Akun
                </a>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9 space-y-8">
            {/* Edit Profile */}
            <div id="edit-profile" className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profil</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Perbarui informasi profil Anda
                </p>
              </div>
              <UpdateProfileForm user={user} />
            </div>

            {/* Change Password */}
            <div id="change-password" className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ubah Password</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Ganti password akun Anda dengan yang lebih aman
                </p>
              </div>
              <UpdatePasswordForm />
            </div>

            {/* Delete Account - Danger Zone */}
            <div id="delete-account" className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-red-600">Zona Berbahaya</h2>
                <p className="text-red-700 text-sm mt-1">
                  Tindakan ini tidak dapat dibatalkan. Silakan berhati-hati.
                </p>
              </div>
              <DeleteAccountForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
