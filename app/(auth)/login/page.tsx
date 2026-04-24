import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Masuk | HidroKaltim',
};

export default function LoginPage() {
  return (
    <>
      {/* Mobile View */}
      <div className="flex md:hidden min-h-screen w-full bg-white flex-col p-6 justify-between">
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Halo 👋
            </h1>
            <p className="text-gray-600">Selamat datang kembali</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <LoginForm />
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
                💧
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
                Masuk ke Akun Anda
              </h2>
              <p className="text-gray-600 mb-8">
                Gunakan email dan password untuk masuk
              </p>

              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
