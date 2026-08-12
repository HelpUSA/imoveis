'use client';

import { useState } from 'react';
import { ShieldCheck, Users, Building2, MessageSquare, Check, X, Server, ExternalLink } from 'lucide-react';

export default function AdminDashboardClient({
  initialUsers,
  totalProperties,
  totalLeads,
}: {
  initialUsers: any[];
  totalProperties: number;
  totalLeads: number;
}) {
  const [users, setUsers] = useState(initialUsers);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const realtors = users.filter((u) => u.role === 'CORRETOR');

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-10">
      {/* Admin Banner */}
      <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Painel de Controle do Desenvolvedor & Admin
        </div>
        <h1 className="text-3xl font-serif font-extrabold text-white">
          Gestão Global do <span className="text-gold-gradient">Site Guarda-Chuva</span>
        </h1>
        <p className="text-xs text-slate-400">
          Gerencie o status dos corretores cadastrados, controle permissões e acesse os guias de infraestrutura (Vercel + Railway).
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Corretores Cadastrados</p>
          <p className="text-2xl font-extrabold text-amber-400 font-serif">{realtors.length}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Imóveis na Vitrine</p>
          <p className="text-2xl font-extrabold text-white font-serif">{totalProperties}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Leads Gerados</p>
          <p className="text-2xl font-extrabold text-emerald-400 font-serif">{totalLeads}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total de Usuários</p>
          <p className="text-2xl font-extrabold text-white font-serif">{users.length}</p>
        </div>
      </div>

      {/* Realtors Management Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-white">
          Corretores Registrados na Plataforma
        </h2>

        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Corretor / Agência</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">CRECI</th>
                  <th className="p-4">Imóveis</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ação Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {realtors.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {r.agencyName || r.name}
                    </td>
                    <td className="p-4">{r.email}</td>
                    <td className="p-4 font-mono text-amber-400 font-semibold">{r.creci || 'CRECI 8492-F'}</td>
                    <td className="p-4 font-mono">{r._count?.properties || 0}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {r.status === 'ACTIVE' ? 'Ativo' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {r.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'BLOCKED')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-bold transition-all"
                        >
                          Suspender
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'ACTIVE')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold transition-all"
                        >
                          Aprovar / Ativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deployment & Infra Guide Box */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Instruções de Deploy (Git, Vercel & Railway)</h3>
            <p className="text-xs text-slate-400">Variáveis de ambiente e banco de dados em nuvem</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
          <p><strong>1. Repositório Git:</strong> Git já está inicializado nesta pasta (<code>D:\dev\AntiG\imoveis</code>).</p>
          <p><strong>2. Railway (PostgreSQL DB):</strong> Crie um projeto no Railway, adicione um banco PostgreSQL e copie a <code>DATABASE_URL</code> no dashboard do Railway.</p>
          <p><strong>3. Vercel (Frontend Next.js):</strong> Conecte o repositório no Vercel e adicione as seguintes variáveis de ambiente:</p>
          <p className="text-amber-400 pl-4">• DATABASE_URL="postgresql://user:pass@railway.app:5432/railway"</p>
          <p className="text-amber-400 pl-4">• NEXTAUTH_SECRET="sua-chave-secreta-jwt-2026"</p>
          <p className="text-amber-400 pl-4">• JWT_SECRET="sua-chave-secreta-jwt-2026"</p>
        </div>
      </div>
    </div>
  );
}
