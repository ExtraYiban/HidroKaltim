const Feature = () => {
    return (
        <div className=" grid grid-cols-3 gap-7">
            <a href="/tma-debit" className="group rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 transition-colors group-hover:bg-cyan-200">
                    <svg className="h-8 w-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        ></path>
                    </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">TMA & Debit</h3>
                <p className="text-gray-600">Monitoring tinggi muka air dan debit sungai untuk manajemen sumber daya air</p>
            </a>

            <a href="/iklim" className="group rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
                <div
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 transition-colors group-hover:bg-yellow-200"
                >
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                    </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Iklim</h3>
                <p className="text-gray-600">Data iklim dan cuaca untuk analisis pola iklim jangka panjang</p>
            </a>

            <a href="/kualitas-air" className="group rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition-colors group-hover:bg-green-200">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Kualitas Air</h3>
                <p className="text-gray-600">Monitoring kualitas air untuk memastikan keamanan dan kebersihan lingkungan</p>
            </a>

            <a href="/permohonan-data" className="group rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
                <div
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 transition-colors group-hover:bg-purple-200"
                >
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                    </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Permohonan Data</h3>
                <p className="text-gray-600">Ajukan permintaan akses data untuk keperluan penelitian dan analisis</p>
            </a>

            <a href="/tentang-kami" className="group rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 transition-colors group-hover:bg-gray-200">
                    <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">Tentang Kami</h3>
                <p className="text-gray-600">Informasi lebih lanjut tentang sistem dan tim pengembang</p>
            </a>
        </div>
    )
}

export default Feature;