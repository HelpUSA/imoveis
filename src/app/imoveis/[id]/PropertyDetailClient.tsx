'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Video,
  CheckCircle,
  Calculator,
  Heart,
  Share2,
  Send,
  Map as MapIcon,
} from 'lucide-react';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] glass-panel rounded-3xl flex items-center justify-center text-amber-400 font-bold text-xs">
      Carregando Mapa de Localização...
    </div>
  ),
});

export default function PropertyDetailClient({ property }: { property: any }) {
  let images: string[] = [];
  try {
    images = JSON.parse(property.images || '[]');
  } catch {
    images = [];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
  }

  let amenities: string[] = [];
  try {
    amenities = JSON.parse(property.amenities || '[]');
  } catch {
    amenities = [];
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'PHOTOS' | 'VIDEO' | 'MAP'>('PHOTOS');
  const [isFavorite, setIsFavorite] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [message, setMessage] = useState(`Olá ${property.realtor.name}! Gostaria de agendar uma visita e saber mais detalhes sobre o imóvel "${property.title}".`);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculator state
  const [downPayment, setDownPayment] = useState(Math.round(property.price * 0.2));
  const [years, setYears] = useState(30);
  const [interestRate, setInterestRate] = useState(10.5);

  const loanAmount = Math.max(0, property.price - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = years * 12;
  const estimatedMonthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleFavoriteClick = async () => {
    try {
      const res = await fetch('/api/portal/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.favorited);
      } else {
        alert('Faça login para salvar seus imóveis favoritos.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/portal/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          clientName,
          clientEmail,
          clientPhone,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do imóvel copiado para a área de transferência!');
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-10">
      {/* Title & Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <span>{property.neighborhood}, {property.city} - {property.state}</span>
            <span>•</span>
            <span>{property.propertyType}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white leading-tight">
            {property.title}
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" /> {property.address}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left md:text-right">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Valor de Investimento</p>
            <p className="text-3xl font-extrabold text-amber-400 font-serif">
              {formatCurrency(property.price)}
            </p>
            {property.rentPrice && (
              <p className="text-xs text-slate-300">
                Aluguel: <strong className="text-white">{formatCurrency(property.rentPrice)}/mês</strong>
              </p>
            )}
          </div>

          <button
            onClick={handleShare}
            className="p-3 rounded-2xl glass-panel text-slate-300 hover:text-amber-400 border border-slate-800"
            title="Compartilhar Imóvel"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Media Gallery Section */}
      <div className="space-y-4">
        {/* Gallery Tabs (Fotos / Vídeo / Mapa) */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('PHOTOS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PHOTOS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Fotos ({images.length})
          </button>

          {property.videoUrl && (
            <button
              onClick={() => setActiveTab('VIDEO')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'VIDEO'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-rose-400 hover:text-white bg-slate-900'
              }`}
            >
              <Video className="w-4 h-4" /> Vídeo do Imóvel
            </button>
          )}

          <button
            onClick={() => setActiveTab('MAP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'MAP'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <MapIcon className="w-4 h-4" /> Ver no Mapa
          </button>
        </div>

        {activeTab === 'PHOTOS' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Featured Photo */}
            <div className="lg:col-span-8 aspect-[16/10] rounded-3xl overflow-hidden glass-panel border border-slate-800 relative bg-slate-950">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Side Thumbnails Grid */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all relative ${
                    i === activeImageIndex ? 'border-amber-400 scale-[0.98]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === 'VIDEO' ? (
          <div className="aspect-video rounded-3xl overflow-hidden glass-panel border border-slate-800 bg-slate-950 flex items-center justify-center p-4">
            <iframe
              src={property.videoUrl.replace('watch?v=', 'embed/')}
              title="Vídeo do Imóvel"
              className="w-full h-full rounded-2xl"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="h-[450px] w-full">
            <PropertyMap properties={[property]} singleMode={true} />
          </div>
        )}
      </div>

      {/* Grid Specs & Details + Sidebar Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details & Amenities */}
        <div className="lg:col-span-7 space-y-10">
          {/* Key Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 glass-panel rounded-3xl border border-slate-800 text-center">
            <div className="space-y-1">
              <BedDouble className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Quartos</p>
              <p className="text-lg font-bold text-white">{property.bedrooms} Dormitórios</p>
            </div>
            <div className="space-y-1">
              <Bath className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Suítes</p>
              <p className="text-lg font-bold text-white">{property.suites} Suítes</p>
            </div>
            <div className="space-y-1">
              <Car className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Vagas</p>
              <p className="text-lg font-bold text-white">{property.parkingSpaces} Vagas</p>
            </div>
            <div className="space-y-1">
              <Maximize2 className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Área Privativa</p>
              <p className="text-lg font-bold text-white">{property.areaTotal} m²</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-white border-b border-slate-800 pb-3">
              Sobre o Imóvel
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Location Map Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-amber-400" /> Localização no Mapa
            </h3>
            <p className="text-xs text-slate-400">
              {property.address} - Bairro {property.neighborhood}, {property.city} - {property.state}
            </p>
            <div className="h-[350px] w-full">
              <PropertyMap properties={[property]} singleMode={true} />
            </div>
          </div>

          {/* Amenities Grid */}
          {amenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-white border-b border-slate-800 pb-3">
                Destaques e Comodidades
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs font-semibold text-slate-200 border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financing Calculator */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">Simulador de Financiamento</h3>
                <p className="text-xs text-slate-400">Estime suas parcelas mensais aproximadas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Entrada (R$)
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Prazo (Anos)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Taxa de Juros a.a. (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300">Valor Financiado: <strong>{formatCurrency(loanAmount)}</strong></p>
                <p className="text-xs text-slate-400">Parcelas estimadas em {years * 12} meses</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-amber-400 font-serif">
                  {formatCurrency(estimatedMonthlyPayment)}<span className="text-xs text-slate-300 font-sans">/mês</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Realtor Card & Direct Inquiry Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Realtor Profile Card */}
          <div className="glass-panel-gold p-6 rounded-3xl border border-amber-500/40 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 overflow-hidden shrink-0">
                {property.realtor.avatarUrl ? (
                  <img src={property.realtor.avatarUrl} alt={property.realtor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-amber-300 text-xl">
                    {property.realtor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Corretor Responsável</p>
                <h4 className="text-lg font-bold text-white">{property.realtor.agencyName || property.realtor.name}</h4>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {property.realtor.creci || 'CRECI Verificado'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
              {property.realtor.bio || 'Corretor credenciado especializado no mercado imobiliário.'}
            </p>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {property.realtor.whatsapp && (
                <a
                  href={`https://wa.me/${property.realtor.whatsapp}?text=Olá%20${encodeURIComponent(property.realtor.name)},%20gostaria%20de%20mais%20informações%20sobre%20o%20imóvel%20"${encodeURIComponent(property.title)}"%20(Ref:%20${property.slug})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> Falar no WhatsApp com o Corretor
                </a>
              )}

              <Link
                href={`/corretores/${property.realtor.id}`}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs text-center block border border-slate-800 transition-colors"
              >
                Ver todos os imóveis deste corretor
              </Link>
            </div>
          </div>

          {/* Lead Inquiry Form */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-400" /> Enviar Mensagem Direta
            </h4>

            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Mensagem Enviada!</p>
                <p className="text-xs text-slate-300">O corretor recebeu sua solicitação e entrará em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seu E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="(83) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mensagem</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs hover:opacity-95 transition-all shadow"
                >
                  {submitting ? 'Enviando...' : 'Enviar Mensagem ao Corretor'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
