import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CorretorDashboardClient from './CorretorDashboardClient';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function CorretorDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'CORRETOR' && user.role !== 'ADMIN') {
    redirect('/dashboard/cliente');
  }

  const realtor = await prisma.user.findUnique({
    where: { id: user.id },
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
  });

  const properties = await prisma.property.findMany({
    where: { realtorId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const leads = await prisma.leadInquiry.findMany({
    where: { realtorId: user.id },
    include: {
      property: {
        select: { title: true, slug: true, price: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <CorretorDashboardClient realtor={realtor} initialProperties={properties} initialLeads={leads} />
      <Footer />
    </div>
  );
}
