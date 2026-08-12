import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: {
            realtor: {
              select: {
                id: true,
                name: true,
                creci: true,
                whatsapp: true,
                agencyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Erro ao carregar favoritos.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Faça login para salvar imóveis nos favoritos.' }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: 'ID do imóvel não informado.' }, { status: 400 });
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        propertyId,
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          propertyId,
        },
      });
      return NextResponse.json({ isFavorite: true });
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Erro ao atualizar favoritos.' }, { status: 500 });
  }
}
