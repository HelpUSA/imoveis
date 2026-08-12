import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HelpUS Imóveis - Portal Guarda-Chuva de Corretores",
  description: "Plataforma profissional guarda-chuva integrando corretores de imóveis credenciados CRECI, com fotos, vídeos, busca por mapa e contatos diretos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased bg-[#0b0f19] text-slate-100">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
