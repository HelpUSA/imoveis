'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { LayoutGrid, Map, Search } from 'lucide-react';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] glass-panel rounded-3xl flex items-center justify-center text-amber-400 font-bold text-xs">
      Carregando Mapa de Imóveis...
    </div>
  ),
});

export default function ImoveisCatalogClient({
  properties,
  search,
  type,
  transaction,
  neighborhood,
}: {
  properties: any[];
  search: string;
  type: string;
  transaction: string;
  neighborhood: string;
}) {
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');

  return (
    <div className="space-y-6">
      {/* Header Bar with View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <p className="text-xs text-slate-300">
          Exibindo <strong className="text-amber-400 font-bold">{properties.length}</strong> imóveis encontrados
        </p>

        {/* Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('GRID')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'GRID'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Lista em Grid
          </button>

          <button
            onClick={() => setViewMode('MAP')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'MAP'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" /> Ver no Mapa Interativo
          </button>
        </div>
      </div>

      {/* Content View: Grid or Map */}
      {viewMode === 'GRID' ? (
        properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-panel rounded-3xl p-8 space-y-4 border border-slate-800">
            <p className="text-lg font-bold text-white">Nenhum imóvel encontrado com os filtros selecionados.</p>
            <p className="text-xs text-slate-400">Tente ajustar seus critérios de busca ou escolha outro bairro.</p>
            <Link
              href="/imoveis"
              className="inline-block px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs"
            >
              Ver Todos os Imóveis
            </Link>
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Map className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Navegue pelo mapa abaixo. Cada marcador exibe o preço do imóvel. Clique para ver a foto e detalhes completos!</span>
          </div>
          <div className="h-[600px] w-full">
            <PropertyMap properties={properties} />
          </div>
        </div>
      )}
    </div>
  );
}
