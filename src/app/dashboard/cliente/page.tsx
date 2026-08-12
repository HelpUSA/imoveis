import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
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
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 space-y-2 shadow-xl">
          <h1 className="text-2xl font-serif font-extrabold text-white">
            Área do Cliente - Bem-vindo, {user.name}!
          </h1>
          <p className="text-xs text-slate-400">
            Gerencie seus imóveis salvos e acompanhe suas consultas com os corretores credenciados.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Meus Imóveis Favoritos ({favorites.length})
            </h2>

            <Link
              href="/imoveis"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" /> Buscar Mais Imóveis
            </Link>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((fav: any) => (
                <PropertyCard key={fav.id} property={fav.property} isFavoriteInitial={true} />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-16 rounded-3xl border border-slate-800 text-center space-y-4">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-bold">Você ainda não possui imóveis salvos nos favoritos.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ao navegar pelos imóveis na nossa vitrine guarda-chuva, clique no ícone de coração para guardar suas casas e coberturas preferidas.
              </p>
              <Link
                href="/imoveis"
                className="inline-block px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs"
              >
                Explorar Imóveis Agora
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
