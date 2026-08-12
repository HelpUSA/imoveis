'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, ArrowLeft, Plus, Trash2, Video, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function AddPropertyPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [transactionType, setTransactionType] = useState('SALE');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Cabo Branco');
  const [city, setCity] = useState('João Pessoa');
  const [state, setState] = useState('PB');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [suites, setSuites] = useState('3');
  const [parkingSpaces, setParkingSpaces] = useState('2');
  const [areaTotal, setAreaTotal] = useState('150');
  const [featured, setFeatured] = useState(false);

  // Images & Video
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [videoUrl, setVideoUrl] = useState('');

  // Amenities Checkboxes
  const availableAmenities = [
    'Vista para o Mar',
    'Piscina',
    'Varanda Gourmet',
    'Automação Residencial',
    'Mobiliado',
    'Portaria 24h',
    'Academia',
    'Gerador',
    'Jacuzzi',
    'Quadra de Tênis',
    'Elevador Privativo',
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Vista para o Mar', 'Varanda Gourmet']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddImage = () => {
    if (!imageUrlInput) return;
    setImages([...images, imageUrlInput]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/portal/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price,
          rentPrice: rentPrice || null,
          transactionType,
          propertyType,
          address,
          neighborhood,
          city,
          state,
          bedrooms,
          bathrooms,
          suites,
          parkingSpaces,
          areaTotal,
          featured,
          images,
          videoUrl: videoUrl || null,
          amenities: selectedAmenities,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao cadastrar imóvel.');
        setLoading(false);
        return;
      }

      router.push('/dashboard/corretor');
    } catch (err) {
      console.error(err);
      setError('Erro ao enviar dados.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </button>
        </div>

        <div className="glass-panel-gold p-8 rounded-3xl border border-amber-500/40 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-serif font-extrabold text-white">Cadastrar Novo Imóvel</h1>
            <p className="text-xs text-slate-400">Preencha as informações completas do imóvel para publicar na vitrine</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">1. Informações Básicas</h3>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título do Imóvel</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mansão Beira-Mar com Piscina em Cabo Branco"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descrição Completa</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva a arquitetura, acabamentos, suítes, vista..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tipo de Operação</label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="SALE">Venda</option>
                    <option value="RENT">Aluguel</option>
                    <option value="BOTH">Venda e Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tipo de Imóvel</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="HOUSE">Casa / Mansão</option>
                    <option value="APARTMENT">Apartamento</option>
                    <option value="PENTHOUSE">Cobertura</option>
                    <option value="COMMERCIAL">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    required
                    placeholder="4850000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-amber-500/40 focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Specs & Location */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">2. Especificações & Localização</h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quartos</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Suítes</label>
                  <input
                    type="number"
                    value={suites}
                    onChange={(e) => setSuites(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Banheiros</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vagas</label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Área (m²)</label>
                  <input
                    type="number"
                    value={areaTotal}
                    onChange={(e) => setAreaTotal(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800 text-center font-bold text-amber-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Endereço</label>
                  <input
                    type="text"
                    required
                    placeholder="Av. Cabo Branco, 2400"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bairro</label>
                  <input
                    type="text"
                    required
                    placeholder="Cabo Branco"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Media: Photos & Video */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">3. Fotos e Vídeo</h3>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adicionar URL da Imagem</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>
              </div>

              {/* Photos Gallery List */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 group">
                    <img src={img} alt={`Foto ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">URL do Vídeo (YouTube)</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl p-2.5 border border-slate-800"
                />
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">4. Destaques e Comodidades</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        isChecked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isChecked && <CheckCircle className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-sm hover:opacity-95 transition-all shadow-xl shadow-amber-500/20"
            >
              {loading ? 'Publicando Imóvel...' : 'Publicar Imóvel na Vitrine Guarda-Chuva'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
