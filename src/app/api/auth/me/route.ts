import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      creci: true,
      phone: true,
      whatsapp: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      agencyName: true,
      status: true,
    },
  });

  return NextResponse.json({ user });
}
