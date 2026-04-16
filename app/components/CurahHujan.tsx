import React, { useState, useMemo } from 'react';

// 1. Interface Definitions
interface Forecast {
    local_datetime: string;
    weather: string;
    t: number;
    weather_desc: string;
    hu: number;
}

interface WeatherForecast {
    local_datetime: string;
    weather: number;
    t: number;
    weather_desc: string;
    hu: number;
}

interface WeatherResponse {
    cuaca: WeatherForecast[][];
}

export type RawWeatherData = WeatherResponse[];

interface WeatherAlert {
    type: 'danger' | 'warning' | 'info' | 'success';
    message: string;
}

interface WeatherDashboardProps {
    loading: boolean;
    forecasts: Forecast[];
    weatherData: RawWeatherData | null; // Data mentah untuk dianalisis getAnalyzeWeather24h
    WeatherMap: React.ComponentType;
}

// 2. Logic Analysis (Helper)
const getAnalyzeWeather24h = (weatherData: RawWeatherData | null): WeatherAlert | null => {
    if (!weatherData?.[0]?.cuaca) return null;

    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const allForecasts: WeatherForecast[] = weatherData[0].cuaca.flat();

    const forecasts24h = allForecasts.filter((forecast) => {
        const forecastDate = new Date(forecast.local_datetime);
        return forecastDate >= now && forecastDate <= next24h;
    });

    if (forecasts24h.length === 0) return null;

    const hasHeavyRain = forecasts24h.some((f) => f.weather >= 95);
    const hasModerateRain = forecasts24h.some((f) => f.weather >= 60 && f.weather < 80);
    const hasLightRain = forecasts24h.some((f) => f.weather >= 10 && f.weather < 60);
    const isClear = forecasts24h.every((f) => f.weather <= 3);

    if (hasHeavyRain) return { type: 'danger', message: 'Peringatan: Potensi hujan lebat disertai petir dalam 24 jam ke depan' };
    if (hasModerateRain) return { type: 'warning', message: 'Peringatan: Potensi hujan sedang dalam 24 jam ke depan' };
    if (hasLightRain) return { type: 'info', message: 'Info: Kemungkinan hujan ringan dalam 24 jam ke depan' };
    if (isClear) return { type: 'success', message: 'Info: Cuaca cerah diprediksi untuk 24 jam ke depan' };

    return { type: 'info', message: 'Info: Cuaca berawan dalam 24 jam ke depan' };
};

// 3. Komponen WeatherAlertBox (Ekstraksi Komponen)
const WeatherAlertBox = ({ alert }: { alert: WeatherAlert | null }) => {
    if (!alert?.message) return null;

    const styles = {
        danger: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800', icon: 'text-red-500' },
        warning: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-800', icon: 'text-orange-500' },
        info: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800', icon: 'text-blue-500' },
        success: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', icon: 'text-green-500' },
    };

    const currentStyle = styles[alert.type];

    return (
        <div className={`mb-6 rounded-lg border-l-4 p-4 ${currentStyle.border} ${currentStyle.bg}`}>
            <div className="flex items-center">
                {/* Render Icon berdasarkan type */}
                {(alert.type === 'danger' || alert.type === 'warning') && (
                    <svg className={`mr-3 h-6 w-6 ${currentStyle.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )}

                {alert.type === 'success' && (
                    <svg className="mr-3 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}

                {alert.type === 'info' && (
                    <svg className="mr-3 h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}

                <p className={`font-medium ${currentStyle.text}`}>
                    {alert.message}
                </p>
            </div>
        </div>
    );
};

// 4. Komponen Utama CurahHujan
const CurahHujan: React.FC<WeatherDashboardProps> = ({
    loading,
    forecasts,
    weatherData,
    WeatherMap,
}) => {
    const [selectedDay, setSelectedDay] = useState<number>(0);

    // Analisis Alert (Memoized)
    const alert = useMemo(() => getAnalyzeWeather24h(weatherData), [weatherData]);

    // --- Helper Functions ---
    const getDayLabel = (day: number) => ["Hari Ini", "Besok", "Lusa"][day] || "";

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } catch { return dateStr; }
    };

    const getWeatherIcon = (weather: string) => {
        const icons: Record<string, string> = { "Clear": "☀️", "Clouds": "☁️", "Rain": "🌧️", "Thunderstorm": "⛈️" };
        return icons[weather] || "☀️";
    };

    return (

        <div className="col-span-1 rounded-2xl bg-white p-8 shadow-lg md:col-span-2 lg:col-span-3">
            {/* Panggil Komponen Alert di Sini */}
            <WeatherAlertBox alert={alert} />
            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="mb-2 text-3xl font-bold text-gray-900">Curah Hujan</h3>
                    <p className="text-gray-600">Data cuaca terkini untuk wilayah Samarinda</p>
                </div>
                <a href="/curah-hujan" className="transform rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    Lihat Detail
                </a>
            </div>


            {/* Weather Cards Section */}
            <div className="relative z-10 mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-xl font-bold text-gray-900">Cuaca Saat Ini</h4>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((day) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedDay === day
                                    ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {getDayLabel(day)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    </div>
                ) : forecasts?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {forecasts.map((forecast, index) => (
                            <div key={`${selectedDay}-${index}`} className="rounded-xl bg-linear-to-br from-blue-50 to-cyan-50 p-6 text-center shadow-md transition-shadow hover:shadow-lg">
                                <div className="mb-2 text-sm text-gray-600">{formatTime(forecast.local_datetime)}</div>
                                <div className="mb-3 text-4xl">{getWeatherIcon(forecast.weather)}</div>
                                <div className="mb-2 text-3xl font-bold text-gray-900">{forecast.t}°</div>
                                <div className="text-sm font-medium text-gray-700">{forecast.weather_desc}</div>
                                <div className="mt-2 text-xs text-gray-500">Kelembaban: {forecast.hu}%</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        <p>Data cuaca tidak tersedia untuk {getDayLabel(selectedDay).toLowerCase()}</p>
                    </div>
                )}
            </div>

            {/* Map Section */}
            <div className="relative">
                <h4 className="relative z-20 mb-4 text-xl font-bold text-gray-900">Peta Samarinda</h4>
                <div className="relative z-0 h-96 overflow-hidden rounded-xl shadow-lg">
                    <WeatherMap />
                </div>
            </div>
        </div>
    );
};

export default CurahHujan;