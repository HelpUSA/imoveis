import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CorretorDashboardClient from './corretor/CorretorDashboardClient';
import AdminDashboardClient from './admin/AdminDashboardClient';
import PropertyCard from '@/components/PropertyCard';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, Building2, ShieldCheck, User } from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/login');
  }

  // Admin View
  if (session.role === 'ADMIN') {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        creci: true,
        agencyName: true,
        createdAt: true,
        _count: {
          select: { properties: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const totalProperties = await prisma.property.count();
    const totalLeads = await prisma.leadInquiry.count();

    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <AdminDashboardClient
          initialUsers={users}
          totalProperties={totalProperties}
          totalLeads={totalLeads}
        />
        <Footer />
      </div>
    );
  }

  // Realtor View
  if (session.role === 'CORRETOR') {
    const realtor = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        creci: true,
        phone: true,
        whatsapp: true,
        agencyName: true,
        avatarUrl: true,
      },
    });

    const properties = await prisma.property.findMany({
      where: { realtorId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    const leads = await prisma.leadInquiry.findMany({
      where: { realtorId: session.id },
      include: {
        property: {
          select: { id: true, title: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <CorretorDashboardClient
          realtor={realtor}
          initialProperties={properties}
          initialLeads={leads}
        />
        <Footer />
      </div>
    );
  }

  // Client (Buyer) View
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    include: {
      property: {
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
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <Heart className="w-4 h-4" /> Área do Comprador
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-white">
            Seus Imóveis <span className="text-gold-gradient">Favoritos</span>
          </h1>
          <p className="text-xs text-slate-400">
            Acompanhe os imóveis salvos e entre em contato direto com os corretores responsáveis.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav: any) => (
              <PropertyCard key={fav.id} property={fav.property} isFavoriteInitial={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-panel rounded-3xl p-8 space-y-4 border border-slate-800">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-lg font-bold text-white">Sua lista de favoritos está vazia.</p>
            <p className="text-xs text-slate-400">Navegue pelos imóveis e clique no coração para salvar seus favoritos.</p>
            <Link
              href="/imoveis"
              className="inline-block px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs"
            >
              Explorar Imóveis no Portal
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
