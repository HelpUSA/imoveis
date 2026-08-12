'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';

interface PropertyMapProps {
  properties: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    neighborhood: string;
    city: string;
    bedrooms: number;
    suites: number;
    parkingSpaces: number;
    areaTotal: number;
    images: string;
    latitude?: number | null;
    longitude?: number | null;
  }>;
  center?: [number, number];
  zoom?: number;
  singleMode?: boolean;
}

export default function PropertyMap({
  properties,
  center = [-7.1189, -34.8260],
  zoom = 13,
  singleMode = false,
}: PropertyMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] glass-panel rounded-3xl flex items-center justify-center text-slate-400 text-xs font-bold animate-pulse">
        Carregando Mapa Interativo...
      </div>
    );
  }

  // Helper to format short price (e.g. 4.85M, 1.65M, 950K)
  const formatShortPrice = (val: number) => {
    if (val >= 1000000) {
      return `R$ ${(val / 1000000).toFixed(2).replace('.', ',')} Mi`;
    } else if (val >= 1000) {
      return `R$ ${(val / 1000).toFixed(0)} Mil`;
    }
    return `R$ ${val}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full h-full min-h-[450px] rounded-3xl overflow-hidden glass-panel border border-slate-800 relative z-0">
      <MapContainerWrapper
        properties={properties}
        center={center}
        zoom={zoom}
        formatShortPrice={formatShortPrice}
        formatCurrency={formatCurrency}
        singleMode={singleMode}
      />
    </div>
  );
}

function MapContainerWrapper({
  properties,
  center,
  zoom,
  formatShortPrice,
  formatCurrency,
  singleMode,
}: {
  properties: any[];
  center: [number, number];
  zoom: number;
  formatShortPrice: (v: number) => string;
  formatCurrency: (v: number) => string;
  singleMode: boolean;
}) {
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

  const validProperties = properties.filter(
    (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
  );

  const initialCenter = singleMode && validProperties.length > 0
    ? [validProperties[0].latitude, validProperties[0].longitude] as [number, number]
    : center;

  return (
    <MapContainer
      center={initialCenter}
      zoom={singleMode ? 15 : zoom}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%', minHeight: singleMode ? '350px' : '550px' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validProperties.map((prop) => {
        let imageList: string[] = [];
        try {
          imageList = JSON.parse(prop.images || '[]');
        } catch {
          imageList = [];
        }
        const mainImage = imageList[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';

        const customIcon = L.divIcon({
          className: 'custom-price-marker-container',
          html: `<div class="custom-price-marker">${formatShortPrice(prop.price)}</div>`,
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });

        return (
          <Marker
            key={prop.id}
            position={[prop.latitude, prop.longitude]}
            icon={customIcon}
          >
            <Popup className="luxury-map-popup">
              <div className="w-64 p-3 space-y-2 bg-[#0f172a] text-slate-100 rounded-2xl">
                <div className="aspect-[16/10] rounded-xl overflow-hidden relative">
                  <img src={mainImage} alt={prop.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/90 text-amber-400 font-extrabold text-xs">
                    {formatCurrency(prop.price)}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-amber-400 font-bold uppercase">{prop.neighborhood}, {prop.city}</p>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{prop.title}</h4>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                  <span>{prop.bedrooms} Qts • {prop.suites} Stes • {prop.areaTotal}m²</span>
                </div>

                <Link
                  href={`/imoveis/${prop.slug}`}
                  className="block w-full py-1.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-[11px] text-center hover:opacity-90 transition-opacity"
                >
                  Ver Fotos e Detalhes →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
