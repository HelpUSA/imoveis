'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
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
  search: initialSearch = '',
  type: initialType = 'ALL',
  transaction: initialTransaction = 'ALL',
  neighborhood: initialNeighborhood = '',
}: {
  properties: any[];
  search?: string;
  type?: string;
  transaction?: string;
  neighborhood?: string;
}) {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>(
    pathname === '/mapa' ? 'MAP' : 'GRID'
  );

  const [filterSearch, setFilterSearch] = useState(initialSearch);
  const [filterType, setFilterType] = useState(initialType);
  const [filterTransaction, setFilterTransaction] = useState(initialTransaction);
  const [filterNeighborhood, setFilterNeighborhood] = useState(initialNeighborhood);

  const filteredProperties = properties.filter((p) => {
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchNeigh = p.neighborhood?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchNeigh && !matchCity) return false;
    }

    if (filterType && filterType !== 'ALL') {
      if (p.propertyType !== filterType) return false;
    }

    if (filterTransaction && filterTransaction !== 'ALL') {
      if (p.transactionType !== filterTransaction && p.transactionType !== 'BOTH') return false;
    }

    if (filterNeighborhood) {
      if (p.neighborhood !== filterNeighborhood) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Busca Livre
            </label>
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Ex: Cobertura, Beira Mar..."
              className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Finalidade */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Finalidade
            </label>
            <select
              value={filterTransaction}
              onChange={(e) => setFilterTransaction(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
            >
              <option value="ALL">Todas</option>
              <option value="SALE">Venda</option>
              <option value="RENT">Aluguel</option>
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="HOUSE">Casa / Mansão</option>
              <option value="APARTMENT">Apartamento</option>
              <option value="PENTHOUSE">Cobertura</option>
              <option value="COMMERCIAL">Comercial</option>
            </select>
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Bairro
            </label>
            <select
              value={filterNeighborhood}
              onChange={(e) => setFilterNeighborhood(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
            >
              <option value="">Todos os Bairros</option>
              <option value="Cabo Branco">Cabo Branco</option>
              <option value="Manaíra">Manaíra</option>
              <option value="Altiplano">Altiplano</option>
              <option value="Tambaú">Tambaú</option>
              <option value="Bessa">Bessa</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setFilterSearch('');
                setFilterType('ALL');
                setFilterTransaction('ALL');
                setFilterNeighborhood('');
              }}
              className="w-full h-[42px] bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all text-xs"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Header Bar with View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <p className="text-xs text-slate-300">
          Exibindo <strong className="text-amber-400 font-bold">{filteredProperties.length}</strong> de {properties.length} imóveis no sistema HelpUS
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
        filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-panel rounded-3xl p-8 space-y-4 border border-slate-800">
            <p className="text-lg font-bold text-white">Nenhum imóvel encontrado com os filtros selecionados.</p>
            <button
              onClick={() => {
                setFilterSearch('');
                setFilterType('ALL');
                setFilterTransaction('ALL');
                setFilterNeighborhood('');
              }}
              className="inline-block px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs"
            >
              Ver Todos os Imóveis
            </button>
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Map className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Navegue pelo mapa abaixo. Cada marcador exibe o valor do imóvel em destaque (ex: R$ 4,85 Mi). Clique em qualquer pino para abrir a foto, ficha técnica e link de detalhes!</span>
          </div>
          <div className="h-[600px] w-full">
            <PropertyMap properties={filteredProperties} />
          </div>
        </div>
      )}
    </div>
  );
}
