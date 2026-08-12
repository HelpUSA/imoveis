import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ShieldCheck, Phone, MessageCircle, Building2, MapPin, Award } from 'lucide-react';

export const revalidate = 0;

export default async function RealtorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Check if searching by ID, email, or "waleska"
  const isWaleskaAlias = id.toLowerCase() === 'waleska';

  const realtor = await prisma.user.findFirst({
    where: isWaleskaAlias
      ? {
          OR: [
            { name: { contains: 'Waleska' } },
            { agencyName: { contains: 'Waleska' } },
            { email: { contains: 'waleska' } },
          ],
        }
      : { id },
    include: {
      properties: {
        where: { status: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!realtor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Realtor Header Banner */}
      <div className="relative bg-slate-950 border-b border-slate-800 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={realtor.coverUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'}
            alt={realtor.name}
            className="w-full h-full object-cover opacity-40 filter saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/50"></div>
        </div>

        {/* Profile Details Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 pb-8">
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-2xl">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-900 border-4 border-amber-400 overflow-hidden shadow-2xl shrink-0 -mt-16 sm:-mt-20">
              {realtor.avatarUrl ? (
                <img src={realtor.avatarUrl} alt={realtor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-500/20 text-amber-300 font-bold text-4xl flex items-center justify-center">
                  {realtor.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Realtor Info */}
            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase">
                  Corretor Credenciado
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs font-mono border border-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {realtor.creci || 'CRECI 8492-F PB'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
                {realtor.agencyName || realtor.name}
              </h1>

              <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
                {realtor.bio || 'Corretor especialista no mercado imobiliário de alto padrão e luxo.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
              {realtor.whatsapp && (
                <a
                  href={`https://wa.me/${realtor.whatsapp}?text=Olá%20${encodeURIComponent(realtor.name)},%20vi%20sua%20página%20no%20portal%20Prime%20Imóveis.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Direto
                </a>
              )}

              {realtor.phone && (
                <a
                  href={`tel:${realtor.phone}`}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs text-center border border-slate-800 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" /> {realtor.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Realtor Property Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">
              Imóveis de <span className="text-gold-gradient">{realtor.agencyName || realtor.name}</span>
            </h2>
            <p className="text-xs text-slate-400">Total de {realtor.properties.length} imóveis ativos nesta vitrine</p>
          </div>
        </div>

        {realtor.properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {realtor.properties.map((prop: any) => (
              <PropertyCard key={prop.id} property={{ ...prop, realtor }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-slate-800">
            <p className="text-slate-400">Este corretor ainda não cadastrou imóveis ativos.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
