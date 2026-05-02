import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useMain } from "@jeza/contexts/hooks/general.v1";

/* ======================================================
   ATUALIZA VIEW (centro / zoom)
====================================================== */
const MapUpdater = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), {
      animate: true,
    });
  }, [lat, lng, map]);

  return null;
};

/* ======================================================
   FIX DE RESIZE (CRÍTICO)
====================================================== */
const MapResizer = ({ isActive }: { isActive: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!isActive) return;

    // 🔥 força recalculo quando aba vira ativa
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 50);

    return () => clearTimeout(t);
  }, [isActive, map]);

  return null;
};

/* ======================================================
   MAIN MAP
====================================================== */
export const MMapPart = ({
  isActive = true,
}: {
  isActive?: boolean;
}) => {
  const { location } = useMain();

  const mapRef = useRef<LeafletMap | null>(null);

  const lat = location?.value?.latitude ?? -23.5505;
  const lng = location?.value?.longitude ?? -46.6333;

  /* 🔥 fallback inicial */
  useEffect(() => {
    const t = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-1 min-h-0 h-full">
      <div className="flex flex-col flex-1 min-h-0 h-full">
        
        {/* HEADER */}
        <div className="p-2 text-xs text-zinc-400 bg-[#1a1a1a] border-b border-black/30">
          Lat: {lat.toFixed(5)} | Lng: {lng.toFixed(5)}
        </div>

        {/* MAP */}
        <div className="flex-1 min-h-0 h-full">
          <MapContainer
            ref={mapRef}
            center={[lat, lng]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapUpdater lat={lat} lng={lng} />
            <MapResizer isActive={isActive} />

            <Marker position={[lat, lng]} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};