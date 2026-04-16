import Image from "next/image";

const Header = () => {
    const navLinks = [
        { name: 'Beranda', active: true },
        { name: 'Curah Hujan', active: false },
        { name: 'TMA & Debit', active: false },
        { name: 'Iklim', active: false },
        { name: 'Kualitas Air', active: false },
        { name: 'Permohonan Data', active: false },
        { name: 'Tentang Kami', active: false },
    ];

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm w-full">
            {/* Logo Section - Tanpa Ikon */}
            <div className="flex items-center gap-2">
                <Image src="/HidroKaltim.png" alt="Logo HidroKaltim" width={40} height={40} className="rounded-full" priority />
                <span className="text-xl font-bold text-slate-800 tracking-tight">
                    Curah Hujan
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden xl:flex items-center gap-8">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={`#${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`text-sm font-medium transition-colors duration-200 py-2 relative
              ${link.active
                                ? 'text-blue-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                                : 'text-slate-600 hover:text-blue-500'}
            `}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-6">
                <button className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                    Masuk
                </button>
                <button className=" bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95">
                    Daftar
                </button>
            </div>
        </header>
    );
};

export default Header;