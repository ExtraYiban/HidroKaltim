import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata = {
  title: 'Reset Password | HidroKaltim',
};

export default function ResetPasswordPage() {
  return (
    <>
      {/* Mobile View */}
      <div className="flex md:hidden min-h-screen w-full bg-white flex-col p-6 justify-between">
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password 🔑
            </h1>
            <p className="text-gray-600 text-sm">
              Masukkan password baru Anda
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ResetPasswordForm />
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>© 2026 HidroKaltim. Semua hak dilindungi.</p>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Left Side - Branding */}
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                🔑
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              HidroKaltim
            </h1>
            <p className="text-gray-600 text-lg">
              Sistem informasi manajemen data hidrologi dan cuaca untuk Kalimantan Timur
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-8">
                Masukkan password baru Anda di bawah ini
              </p>

              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
