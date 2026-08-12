import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImoveisCatalogClient from './ImoveisCatalogClient';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const revalidate = 60;

interface SearchParams {
  search?: string;
  type?: string;
  transaction?: string;
  neighborhood?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  realtorId?: string;
}

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const search = params.search || '';
  const type = params.type || '';
  const transaction = params.transaction || '';
  const neighborhood = params.neighborhood || '';
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const bedrooms = params.bedrooms;
  const realtorId = params.realtorId;

  const where: any = { status: 'AVAILABLE' };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { neighborhood: { contains: search } },
      { city: { contains: search } },
      { address: { contains: search } },
    ];
  }

  if (type && type !== 'ALL') where.propertyType = type;
  if (transaction && transaction !== 'ALL') {
    where.OR = [{ transactionType: transaction }, { transactionType: 'BOTH' }];
  }
  if (neighborhood) where.neighborhood = { contains: neighborhood };
  if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
  if (realtorId) where.realtorId = realtorId;

  const properties = await prisma.property.findMany({
    where,
    include: {
      realtor: {
        select: {
          id: true,
          name: true,
          creci: true,
          whatsapp: true,
          avatarUrl: true,
          agencyName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-[#0b0f19] to-[#0b0f19] border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
              Catálogo de Imóveis dos <span className="text-gold-gradient">Corretores</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Explore o portfólio completo de ofertas. Alterne entre a visão em lista e o **mapa interativo** para localizar imóveis por valor e localização.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Search Bar & Filters Form */}
        <div className="glass-panel p-6 rounded-3xl mb-8 border border-slate-800 space-y-4">
          <form method="GET" action="/imoveis" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Busca Livre
              </label>
              <input
                type="text"
                name="search"
                defaultValue={search}
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
                name="transaction"
                defaultValue={transaction || 'ALL'}
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
                name="type"
                defaultValue={type || 'ALL'}
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
                name="neighborhood"
                defaultValue={neighborhood || ''}
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

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-[42px] bg-gold-gradient text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all text-xs"
              >
                <Search className="w-4 h-4" /> Filtrar
              </button>
            </div>
          </form>
        </div>

        {/* Client Interactive Component (Grid & Map Switcher) */}
        <ImoveisCatalogClient
          properties={properties}
          search={search}
          type={type}
          transaction={transaction}
          neighborhood={neighborhood}
        />
      </div>

      <Footer />
    </div>
  );
}
