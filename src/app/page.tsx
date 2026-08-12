import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSearch from '@/components/HeroSearch';
import PropertyCard from '@/components/PropertyCard';
import RealtorCard from '@/components/RealtorCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, ShieldCheck, Sparkles, Building2, Users, MapPin, CheckCircle2, MessageSquare, Award } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const featuredProperties = await prisma.property.findMany({
    where: { status: 'AVAILABLE' },
    take: 6,
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
  });

  // Popular Neighborhoods Data
  const popularNeighborhoods = [
    { name: 'Cabo Branco', desc: 'Beira-mar e alta valorização', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80' },
    { name: 'Altiplano', desc: 'Coberturas duplex e vista 360°', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
    { name: 'Manaíra', desc: 'Quadra do mar e gastronomia', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tambaú', desc: 'Turismo, praia e comércio prime', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Search Section */}
      <HeroSearch />

      {/* Featured Properties Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Portfólio de Exclusividades
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
              Imóveis em <span className="text-gold-gradient">Destaque</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Residências selecionadas pelos corretores credenciados da nossa plataforma guarda-chuva.
            </p>
          </div>

          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/50 hover:bg-slate-800 font-bold text-sm transition-all shrink-0"
          >
            Ver Todos os Imóveis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Property Grid */}
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop: any) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl p-8">
            <p className="text-slate-400">Nenhum imóvel disponível no momento.</p>
          </div>
        )}
      </section>

      {/* Popular Neighborhoods Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <MapPin className="w-4 h-4" /> Localizações Nobres
            </div>
            <h2 className="text-3xl font-serif font-extrabold text-white">
              Bairros Mais Procurados em <span className="text-gold-gradient">João Pessoa</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Explore imóveis nas regiões com maior índice de valorização e qualidade de vida.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularNeighborhoods.map((b) => (
              <Link
                key={b.name}
                href={`/imoveis?neighborhood=${encodeURIComponent(b.name)}`}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass-panel border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl"
              >
                <img
                  src={b.img}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                    {b.name}
                  </h3>
                  <p className="text-xs text-slate-300">{b.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Registered Realtors Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-3 mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <Users className="w-4 h-4" /> Rede de Corretores
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
            Nossos Corretores <span className="text-gold-gradient">Cadastrados</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Cada corretor possui seu próprio acesso e painel para atualizar suas ofertas com fotos, vídeos e detalhes em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {realtors.map((realtor: any) => (
            <RealtorCard key={realtor.id} realtor={realtor} />
          ))}
        </div>
      </section>

      {/* Benefits / Platform Features */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-extrabold text-white">
              Vantagens do Nosso <span className="text-gold-gradient">Site Guarda-Chuva</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Um ambiente integrado que une transparência para clientes e autonomia para corretores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Vitrine Unificada</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Todos os imóveis dos corretores parceiros expostos em uma única vitrine elegante e moderna de busca rápida e no mapa.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Logins com Autonomia</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Cada corretor gerencia suas próprias ofertas, envia fotos, vídeos e recebe mensagens de compradores diretamente.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl space-y-4 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Contato sem Intermediários</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Leads de compradores são direcionados na hora para o WhatsApp ou e-mail do corretor responsável pelo imóvel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
