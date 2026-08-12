import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImoveisCatalogClient from '../imoveis/ImoveisCatalogClient';
import { prisma } from '@/lib/prisma';
import { Map, Search } from 'lucide-react';

export const revalidate = 0;

export default async function MapaPage() {
  const properties = await prisma.property.findMany({
    where: { status: 'AVAILABLE' },
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
      <div className="bg-gradient-to-b from-slate-950 via-[#0b0f19] to-[#0b0f19] border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Map className="w-4 h-4" /> Navegação por Geolocalização
            </div>
            <h1 className="text-3xl font-extrabold font-serif text-white">
              Mapa Interativo de <span className="text-gold-gradient">Imóveis - HelpUS</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Navegue pelos marcadores no mapa. Cada pino exibe o preço exato do imóvel. Clique em qualquer marcador para abrir o card com fotos, características e link para a página completa!
            </p>
          </div>
        </div>
      </div>

      {/* Full Page Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <ImoveisCatalogClient
          properties={properties}
          search=""
          type="ALL"
          transaction="ALL"
          neighborhood=""
        />
      </div>

      <Footer />
    </div>
  );
}
