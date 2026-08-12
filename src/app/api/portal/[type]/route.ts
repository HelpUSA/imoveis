import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  // GET /api/portal/realtors
  if (type === 'realtors') {
    const realtors = await prisma.user.findMany({
      where: { role: 'CORRETOR', status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
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
    });
    return NextResponse.json({ realtors });
  }

  // GET /api/portal/favorites
  if (type === 'favorites') {
    const session = await getCurrentUser();
    if (!session) return NextResponse.json({ favorites: [] });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.id },
      include: {
        property: {
          include: {
            realtor: {
              select: {
                id: true,
                name: true,
                creci: true,
                whatsapp: true,
                avatarUrl: true,
                agencyName: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ favorites });
  }

  // GET /api/portal/leads
  if (type === 'leads') {
    const session = await getCurrentUser();
    if (!session || (session.role !== 'CORRETOR' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    const leads = await prisma.leadInquiry.findMany({
      where: session.role === 'CORRETOR' ? { realtorId: session.id } : {},
      include: {
        property: {
          select: { id: true, title: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leads });
  }

  // GET /api/portal/admin-users
  if (type === 'admin-users') {
    const session = await getCurrentUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        creci: true,
        agencyName: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ users });
  }

  return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  // POST /api/portal/favorites
  if (type === 'favorites') {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Você precisa estar logado para favoritar.' }, { status: 401 });
    }

    const { propertyId } = await req.json();
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: session.id,
        propertyId,
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({
        data: { userId: session.id, propertyId },
      });
      return NextResponse.json({ favorited: true });
    }
  }

  // POST /api/portal/leads
  if (type === 'leads') {
    const { propertyId, name, email, phone, message } = await req.json();

    if (!propertyId || !name || !phone) {
      return NextResponse.json({ error: 'Preencha nome e telefone de contato.' }, { status: 400 });
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
        clientName: name,
        clientEmail: email || '',
        clientPhone: phone,
        message: message || 'Tenho interesse neste imóvel.',
      },
    });

    return NextResponse.json({ success: true, lead });
  }

  return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;

  // PUT /api/portal/admin-users
  if (type === 'admin-users') {
    const session = await getCurrentUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { userId, status } = await req.json();
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    return NextResponse.json({ user: updated });
  }

  return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
}
