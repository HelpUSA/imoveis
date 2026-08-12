'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, User, ShieldCheck, Mail, Lock, Phone, MessageCircle } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState<'CLIENT' | 'CORRETOR'>('CORRETOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creci, setCreci] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name,
          email,
          password,
          creci,
          phone,
          whatsapp,
          agencyName,
          bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao realizar cadastro.');
        setLoading(false);
        return;
      }

      if (data.user.role === 'CORRETOR') {
        window.location.href = '/dashboard/corretor';
      } else {
        window.location.href = '/dashboard/cliente';
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro no servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6 glass-panel-gold p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient text-slate-950 font-bold flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-extrabold text-white">Criar Nova Conta</h2>
            <p className="text-xs text-slate-400">Escolha o seu perfil de acesso na plataforma</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('CORRETOR')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'CORRETOR'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Sou Corretor (CRECI)
            </button>
            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'CLIENT'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Sou Comprador / Cliente
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                {role === 'CORRETOR' ? 'Nome Completo / Imobiliária' : 'Nome Completo'}
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Waleska Imóveis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Additional Fields for Realtor */}
            {role === 'CORRETOR' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">
                      Registro CRECI
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: CRECI 8492-F PB"
                      value={creci}
                      onChange={(e) => setCreci(e.target.value)}
                      className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-amber-500/40 focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Nome Fantasia / Marca
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Waleska Imóveis Luxo"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Telefone</label>
                    <input
                      type="tel"
                      placeholder="(83) 99999-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">
                      WhatsApp Atendimento
                    </label>
                    <input
                      type="tel"
                      placeholder="5583999990000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-emerald-500/40 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Biografia / Especialidade
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Resumo do seu foco de atuação (ex: Alto padrão na beira-mar de João Pessoa)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Cadastrando...' : role === 'CORRETOR' ? 'Concluir Cadastro de Corretor' : 'Concluir Cadastro'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-amber-400 font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
