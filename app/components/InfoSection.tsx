const infoSection = () => {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        ></path>
                    </svg>
                </div>
                <div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">Tentang Platform</h3>
                    <p className="mb-4 leading-relaxed text-gray-600">
                        Platform ini menyediakan data monitoring real-time untuk berbagai parameter hidrologi dan klimatologi. Sistem kami
                        mengintegrasikan data dari berbagai sumber termasuk BMKG untuk memberikan informasi yang akurat dan up-to-date.
                    </p>
                    <p className="leading-relaxed text-gray-600">
                        Dengan visualisasi data yang interaktif dan mudah dipahami, platform ini membantu dalam pengambilan keputusan terkait
                        manajemen sumber daya air dan mitigasi bencana.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default infoSection;