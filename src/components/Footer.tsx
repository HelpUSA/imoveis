import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-serif">PRIME IMÓVEIS</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A plataforma guarda-chuva de corretores credenciados que reúne os melhores imóveis de alto padrão e luxo da região.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Corretores 100% Verificados & Registrados</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/imoveis?transaction=SALE" className="hover:text-amber-400 transition-colors">
                  Imóveis à Venda
                </Link>
              </li>
              <li>
                <Link href="/imoveis?transaction=RENT" className="hover:text-amber-400 transition-colors">
                  Imóveis para Alugar
                </Link>
              </li>
              <li>
                <Link href="/imoveis?featured=true" className="hover:text-amber-400 transition-colors">
                  Destaques Exclusivos
                </Link>
              </li>
              <li>
                <Link href="/corretores" className="hover:text-amber-400 transition-colors">
                  Encontrar um Corretor
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Realtors & Agencies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Corretores em Destaque</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/corretores/waleska" className="text-amber-300 font-semibold hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Waleska Imóveis Luxo (CRECI 8492-F)
                </Link>
              </li>
              <li>
                <Link href="/corretores" className="hover:text-amber-400 transition-colors">
                  Carlos Eduardo Prime (CRECI 11420-F)
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="text-xs text-amber-400/80 hover:text-amber-300 hover:underline pt-2 block">
                  👉 É corretor? Cadastre-se na plataforma
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Central de Atendimento</h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>João Pessoa - PB (Orla da Praia)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(83) 99823-4567 / (83) 99999-0000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contato@primeimoveis.com.br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} Prime Imóveis. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para Corretores de Imóveis.
          </p>
        </div>
      </div>
    </footer>
  );
}
