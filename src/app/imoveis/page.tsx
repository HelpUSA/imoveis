import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImoveisCatalogClient from './ImoveisCatalogClient';
import { prisma } from '@/lib/prisma';
import { Search } from 'lucide-react';

export const revalidate = 60;

export default async function ImoveisPage() {
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
      <div className="bg-gradient-to-b from-slate-950 via-[#0b0f19] to-[#0b0f19] border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
              Catálogo de Imóveis dos <span className="text-gold-gradient">Corretores</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Explore o portfólio completo de ofertas. Alterne entre a visão em lista e o <strong>mapa interativo</strong> para localizar imóveis por valor e localização.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
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
