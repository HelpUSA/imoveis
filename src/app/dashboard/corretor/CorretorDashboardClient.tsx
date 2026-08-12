'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  PlusCircle,
  Eye,
  MessageSquare,
  ShieldCheck,
  Trash2,
  Edit,
  CheckCircle,
  ExternalLink,
  Phone,
  MessageCircle,
  Search,
  Check,
} from 'lucide-react';

export default function CorretorDashboardClient({
  realtor,
  initialProperties,
  initialLeads,
}: {
  realtor: any;
  initialProperties: any[];
  initialLeads: any[];
}) {
  const [properties, setProperties] = useState(initialProperties);
  const [leads, setLeads] = useState(initialLeads);
  const [activeTab, setActiveTab] = useState<'PROPERTIES' | 'LEADS'>('PROPERTIES');
  const [searchTerm, setSearchTerm] = useState('');

  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Tem certeza de que deseja excluir este imóvel?')) return;

    try {
      const res = await fetch(`/api/portal/properties?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProperties(properties.filter((p) => p.id !== id));
      } else {
        alert('Erro ao excluir imóvel.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'RESERVED' : currentStatus === 'RESERVED' ? 'SOLD' : 'AVAILABLE';

    try {
      const res = await fetch(`/api/portal/properties?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setProperties(properties.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-8">
      {/* Realtor Profile Banner */}
      <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 overflow-hidden shrink-0">
            {realtor?.avatarUrl ? (
              <img src={realtor.avatarUrl} alt={realtor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-amber-300 text-xl">
                {realtor?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-serif font-extrabold text-white">
                Painel do Corretor - {realtor?.agencyName || realtor?.name}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1 justify-center md:justify-start">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {realtor?.creci || 'CRECI Credenciado'}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/corretor/imoveis/novo"
          className="px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Cadastrar Novo Imóvel
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total de Imóveis</p>
          <p className="text-2xl font-extrabold text-white font-serif">{properties.length}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Imóveis Ativos</p>
          <p className="text-2xl font-extrabold text-amber-400 font-serif">
            {properties.filter((p) => p.status === 'AVAILABLE').length}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Visualizações Totais</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-serif">{totalViews}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Leads / Mensagens</p>
          <p className="text-2xl font-extrabold text-amber-400 font-serif">{leads.length}</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('PROPERTIES')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'PROPERTIES'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Meus Imóveis ({properties.length})
        </button>

        <button
          onClick={() => setActiveTab('LEADS')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'LEADS'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Mensagens dos Clientes ({leads.length})
        </button>
      </div>

      {/* Tab: PROPERTIES */}
      {activeTab === 'PROPERTIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filtrar meus imóveis por título ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-800"
              />
            </div>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Imóvel</th>
                    <th className="p-4">Bairro</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Visualizações</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 font-semibold text-white">
                          <Link href={`/imoveis/${prop.slug}`} className="hover:text-amber-400 flex items-center gap-2">
                            {prop.title}
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </Link>
                        </td>
                        <td className="p-4">{prop.neighborhood}</td>
                        <td className="p-4 font-mono font-bold text-amber-400">{formatCurrency(prop.price)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(prop.id, prop.status)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              prop.status === 'AVAILABLE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : prop.status === 'RESERVED'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {prop.status === 'AVAILABLE' ? 'Disponível' : prop.status === 'RESERVED' ? 'Reservado' : 'Vendido'}
                          </button>
                        </td>
                        <td className="p-4 font-mono">{prop.viewsCount || 0}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProperty(prop.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                            title="Excluir Imóvel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Nenhum imóvel cadastrado. Clique no botão acima para adicionar o primeiro imóvel!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: LEADS */}
      {activeTab === 'LEADS' && (
        <div className="space-y-4">
          {leads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead) => (
                <div key={lead.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">{lead.clientName}</h4>
                      <p className="text-xs text-slate-400">{lead.clientEmail} • {lead.clientPhone}</p>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <p className="text-xs text-amber-300 font-semibold">
                    Imóvel de Interesse: <span className="text-white">{lead.property?.title}</span>
                  </p>

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 italic">
                    "{lead.message}"
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${lead.clientPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(lead.clientName)},%20sou%20${encodeURIComponent(realtor.name)}.%20Recebi%20seu%20contato%20sobre%20o%20imóvel%20"${encodeURIComponent(lead.property?.title)}".`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" /> Responder no WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Nenhuma mensagem recebida ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
