'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Building2, Search, Heart, User, LogOut, LayoutDashboard, PlusCircle, ShieldCheck, Menu, X, Map } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserAndFavorites();
  }, [pathname]);

  const fetchUserAndFavorites = async () => {
    try {
      const resUser = await fetch('/api/auth/me');
      const dataUser = await resUser.json();
      setUser(dataUser.user);

      if (dataUser.user) {
        const resFav = await fetch('/api/favorites');
        const dataFav = await resFav.json();
        setFavoritesCount(dataFav.favorites?.length || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: HelpUS Imóveis */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">HelpUS</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                IMÓVEIS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Portal Guarda-Chuva de Corretores
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link
            href="/"
            className={`hover:text-amber-400 transition-colors ${pathname === '/' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Início
          </Link>
          <Link
            href="/imoveis"
            className={`hover:text-amber-400 transition-colors ${pathname.startsWith('/imoveis') ? 'text-amber-400 font-semibold' : ''}`}
          >
            Buscar Imóveis
          </Link>

          {/* Direct Map Link */}
          <Link
            href="/mapa"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              pathname === '/mapa'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Ver Mapa de Imóveis
          </Link>

          <Link
            href="/corretores"
            className={`hover:text-amber-400 transition-colors ${pathname.startsWith('/corretores') ? 'text-amber-400 font-semibold' : ''}`}
          >
            Nossos Corretores
          </Link>
        </nav>

        {/* Desktop Action & Auth Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Favorites counter */}
          <Link
            href="/dashboard/cliente"
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
            title="Seus Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full flex items-center justify-center shadow">
                {favoritesCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white truncate max-w-[120px]">{user.name}</p>
                  <p className="text-[10px] text-amber-400 font-mono">
                    {user.role === 'ADMIN' ? 'ADMIN' : user.role === 'CORRETOR' ? (user.creci || 'CORRETOR') : 'COMPRADOR'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 glass-panel-gold rounded-2xl p-2 shadow-2xl z-50 text-sm">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-400">Conectado como</p>
                    <p className="text-xs font-bold text-white truncate">{user.email}</p>
                  </div>

                  {user.role === 'CORRETOR' && (
                    <>
                      <Link
                        href="/dashboard/corretor"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        Painel do Corretor
                      </Link>
                      <Link
                        href="/dashboard/corretor/imoveis/novo"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-400" />
                        Cadastrar Imóvel
                      </Link>
                    </>
                  )}

                  {user.role === 'CLIENT' && (
                    <Link
                      href="/dashboard/cliente"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-amber-400" />
                      Meus Favoritos
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Painel Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 border-t border-slate-800/60"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da Conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all border border-slate-800"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-gold-gradient text-slate-950 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all"
              >
                Cadastrar-se
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-amber-400"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-gold border-t border-slate-800 px-4 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium hover:text-amber-400"
          >
            Início
          </Link>
          <Link
            href="/imoveis"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium hover:text-amber-400"
          >
            Buscar Imóveis
          </Link>
          <Link
            href="/mapa"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-amber-300 font-bold hover:text-amber-400"
          >
            🗺️ Ver Imóveis no Mapa
          </Link>
          <Link
            href="/corretores"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium hover:text-amber-400"
          >
            Nossos Corretores
          </Link>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <>
                <p className="text-xs text-slate-400">Logado como: <strong className="text-white">{user.name}</strong></p>
                {user.role === 'CORRETOR' && (
                  <Link
                    href="/dashboard/corretor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-xl bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                  >
                    Painel do Corretor
                  </Link>
                )}
                {user.role === 'CLIENT' && (
                  <Link
                    href="/dashboard/cliente"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-xl bg-slate-800 text-amber-300 font-semibold"
                  >
                    Meus Favoritos ({favoritesCount})
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-xl bg-amber-500/20 text-amber-300 font-semibold"
                  >
                    Painel Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center rounded-xl bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20"
                >
                  Sair da Conta
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-slate-900 text-slate-200 font-semibold border border-slate-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-gold-gradient text-slate-950 font-bold"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
