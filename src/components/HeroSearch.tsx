'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, DollarSign, Filter, Sparkles } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [transaction, setTransaction] = useState<'ALL' | 'SALE' | 'RENT'>('ALL');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [neighborhood, setNeighborhood] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (transaction !== 'ALL') params.set('transaction', transaction);
    if (search) params.set('search', search);
    if (type !== 'ALL') params.set('type', type);
    if (neighborhood) params.set('neighborhood', neighborhood);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 overflow-hidden">
      {/* Background Image with dark luxury overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Mansão de Luxo"
          className="w-full h-full object-cover opacity-35 scale-105 filter saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19]/80 via-transparent to-[#0b0f19]/80"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
        {/* Badge Slogan */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-gold text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          Plataforma Exclusiva Guarda-Chuva de Imóveis de Alto Padrão
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white tracking-tight leading-tight">
            Encontre o Imóvel dos Seus Sonhos com os <span className="text-gold-gradient">Melhores Corretores</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Casas à beira-mar, coberturas duplex e apartamentos de alto padrão em João Pessoa e região. Corretores credenciados reunidos em um só lugar.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="glass-panel-gold rounded-3xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto border border-amber-500/30">
          {/* Tabs: Venda / Aluguel / Todos */}
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setTransaction('ALL')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                transaction === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Todos os Imóveis
            </button>
            <button
              type="button"
              onClick={() => setTransaction('SALE')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                transaction === 'SALE'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              À Venda
            </button>
            <button
              type="button"
              onClick={() => setTransaction('RENT')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                transaction === 'RENT'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Para Alugar
            </button>
          </div>

          {/* Form Inputs Grid */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search Term / Keyword */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">
                Palavra-Chave / Nome
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Ex: Beira-mar, Mansão..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/90 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Neighborhood / Bairro */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">
                Bairro / Região
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-950/90 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:border-amber-400 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Todos os Bairros</option>
                  <option value="Cabo Branco">Cabo Branco</option>
                  <option value="Manaíra">Manaíra</option>
                  <option value="Altiplano">Altiplano</option>
                  <option value="Tambaú">Tambaú</option>
                  <option value="Bessa">Bessa</option>
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-left">
                Tipo de Imóvel
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950/90 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:border-amber-400 focus:outline-none transition-colors appearance-none"
                >
                  <option value="ALL">Todos os Tipos</option>
                  <option value="HOUSE">Casa / Mansão</option>
                  <option value="APARTMENT">Apartamento</option>
                  <option value="PENTHOUSE">Cobertura</option>
                  <option value="COMMERCIAL">Comercial</option>
                </select>
              </div>
            </div>

            {/* Submit Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-[46px] bg-gold-gradient hover:opacity-95 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <Search className="w-4 h-4" />
                Buscar Imóveis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
