import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtorCard from '@/components/RealtorCard';
import { prisma } from '@/lib/prisma';
import { Users, ShieldCheck } from 'lucide-react';

export const revalidate = 60;

export default async function CorretoresPage() {
  const realtors = await prisma.user.findMany({
    where: { role: 'CORRETOR', status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      creci: true,
      phone: true,
      whatsapp: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      agencyName: true,
      _count: {
        select: { properties: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-[#0b0f19] to-[#0b0f19] border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Corretores Credenciados CRECI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
            Nossos Corretores <span className="text-gold-gradient">Parceiros</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Conheça os profissionais credenciados que fazem parte do nosso site guarda-chuva e explore a seleção exclusiva de imóveis de cada um.
          </p>
        </div>
      </div>

      {/* Realtors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {realtors.map((realtor: any) => (
            <RealtorCard key={realtor.id} realtor={realtor} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
