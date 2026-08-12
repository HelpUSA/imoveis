import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardClient from './AdminDashboardClient';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      creci: true,
      agencyName: true,
      phone: true,
      whatsapp: true,
      createdAt: true,
      _count: {
        select: { properties: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalProperties = await prisma.property.count();
  const totalLeads = await prisma.leadInquiry.count();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <AdminDashboardClient
        initialUsers={users}
        totalProperties={totalProperties}
        totalLeads={totalLeads}
      />
      <Footer />
    </div>
  );
}
