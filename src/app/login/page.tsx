'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { Building2, Lock, Mail, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao realizar login.');
        setLoading(false);
        return;
      }

      if (data.user.role === 'CORRETOR') {
        window.location.href = '/dashboard/corretor';
      } else if (data.user.role === 'ADMIN') {
        window.location.href = '/dashboard/admin';
      } else {
        window.location.href = '/dashboard/cliente';
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao conectar ao servidor.');
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 glass-panel-gold p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient text-slate-950 font-bold flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-extrabold text-white">Acessar a Plataforma</h2>
            <p className="text-xs text-slate-400">
              Entre com sua conta do Google ou dados cadastrados
            </p>
          </div>

          {/* Google Sign In Button */}
          <GoogleLoginButton label="Entrar com Conta do Google" />

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-[#0f172a] px-3 text-[10px] uppercase font-bold text-slate-500 absolute">ou com e-mail</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </form>

          {/* Quick Demo Logins Box */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest text-center flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3" /> Logins de Demonstração Rápida:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('waleska@imoveis.com', '123456')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-amber-300 text-center transition-colors"
              >
                Waleska (Corretora)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('cliente@imoveis.com', '123456')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 text-center transition-colors"
              >
                Comprador (Cliente)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@imoveis.com', 'admin123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-rose-400 text-center transition-colors"
              >
                Admin (Dev)
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-amber-400 font-bold hover:underline">
              Cadastre-se aqui
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
