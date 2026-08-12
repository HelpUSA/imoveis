import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const realtors = await prisma.user.findMany({
      where: {
        role: 'CORRETOR',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        creci: true,
        phone: true,
        whatsapp: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        agencyName: true,
        _count: {
          select: { properties: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ realtors });
  } catch (error: any) {
    console.error('Error fetching realtors:', error);
    return NextResponse.json({ error: 'Erro ao carregar lista de corretores.' }, { status: 500 });
  }
}
