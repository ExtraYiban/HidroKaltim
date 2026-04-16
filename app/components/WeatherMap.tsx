"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    lat: number;
    lng: number;
};

export default function WeatherMap({ lat, lng }: Props) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<LeafletMap | null>(null);
    const markerInstance = useRef<LeafletMarker | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.setView([lat, lng], mapInstance.current.getZoom());
            markerInstance.current?.setLatLng([lat, lng]);
            return;
        }

        let isMounted = true;
        let rafId: number | null = null;

        void (async () => {
            const L = await import("leaflet");
            if (!isMounted || !mapRef.current || mapInstance.current) return;

            // Ensure marker assets resolve correctly when bundled by Next.js.
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current).setView([lat, lng], 12);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);

            markerInstance.current = L.marker([lat, lng]).addTo(map);

            mapInstance.current = map;

            rafId = requestAnimationFrame(() => {
                if (!isMounted || mapInstance.current !== map || !mapRef.current) return;
                map.invalidateSize();
            });
        })();

        return () => {
            isMounted = false;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            markerInstance.current = null;
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, [lat, lng]);

    return <div ref={mapRef} className="h-full w-full rounded-xl" aria-label="OpenStreetMap" />;
}