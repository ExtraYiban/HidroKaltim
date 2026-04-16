"use client";

import { useEffect, useState } from "react";
import Greeting from "./Greeting";
import CurahHujan from "./CurahHujan";
import type { RawWeatherData } from "./CurahHujan";
import Feature from "./Feature";
import InfoSection from "./InfoSection";
import WeatherMap from "./WeatherMap";

// 1. Definisi Tipe Data
interface Forecast {
    local_datetime: string;
    weather: string;
    t: number;
    weather_desc: string;
    hu: number;
}



const Body = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dataForecast, setDataForecast] = useState<Forecast[]>([]);

    // Tambahkan state untuk data mentah cuaca (untuk kebutuhan alert)
    const [rawWeatherData, setRawWeatherData] = useState<RawWeatherData | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            // 2. Mock API Response sesuai struktur yang diharapkan fungsi analisis
            // Struktur: Array -> Object -> cuaca -> Array -> Object
            const mockFullResponse: RawWeatherData = [
                {
                    cuaca: [
                        [
                            {
                                local_datetime: "2026-04-16 10:00",
                                weather: 60, // Kode 60 = Potensi Hujan Sedang
                                t: 28,
                                weather_desc: "Hujan Sedang",
                                hu: 85
                            },
                            {
                                local_datetime: "2026-04-16 13:00",
                                weather: 3,
                                t: 31,
                                weather_desc: "Berawan",
                                hu: 70
                            }
                        ]
                    ]
                }
            ];

            // Set data mentah untuk fungsi getAnalyzeWeather24h di dalam komponen CurahHujan
            setRawWeatherData(mockFullResponse);

            // Set data forecast (flattened) untuk tampilan kartu
            // Mapping kode weather (number) ke string agar sesuai interface Forecast
            const flattened: Forecast[] = mockFullResponse[0].cuaca.flat().map(item => ({
                ...item,
                weather: item.weather >= 60 ? "Rain" : "Clouds" // Contoh mapping sederhana
            }));

            setDataForecast(flattened);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col mx-auto max-w-6xl gap-5">
                <Greeting />

                {/* 3. Kirim rawWeatherData ke CurahHujan */}
                <CurahHujan
                    loading={isLoading}
                    forecasts={dataForecast}
                    weatherData={rawWeatherData}
                    WeatherMap={() => <WeatherMap lat={-0.4922} lng={117.1436} />}
                />

                <Feature />
                <InfoSection />
            </div>
        </div>
    );
};

export default Body;