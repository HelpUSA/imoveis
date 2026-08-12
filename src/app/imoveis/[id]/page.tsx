import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyDetailClient from './PropertyDetailClient';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      realtor: {
        select: {
          id: true,
          name: true,
          email: true,
          creci: true,
          phone: true,
          whatsapp: true,
          bio: true,
          avatarUrl: true,
          agencyName: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <PropertyDetailClient property={property} />
      <Footer />
    </div>
  );
}
