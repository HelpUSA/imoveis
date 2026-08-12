import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const where = user.role === 'ADMIN' ? {} : { realtorId: user.id };

    const leads = await prisma.leadInquiry.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Erro ao carregar leads.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { propertyId, clientName, clientEmail, clientPhone, message } = await req.json();

    if (!propertyId || !clientName || !clientEmail || !clientPhone || !message) {
      return NextResponse.json({ error: 'Preencha todos os campos da mensagem.' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { realtorId: true },
    });

    if (!property) {
      return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
    }

    const lead = await prisma.leadInquiry.create({
      data: {
        propertyId,
        realtorId: property.realtorId,
        clientName,
        clientEmail,
        clientPhone,
        message,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Erro ao enviar mensagem.' }, { status: 500 });
  }
}
