import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const { searchParams } = new URL(req.url);

  // GET /api/portal/properties
  if (type === 'properties') {
    const id = searchParams.get('id');
    if (id) {
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          realtor: {
            select: {
              id: true,
              name: true,
              email: true,
              creci: true,
              whatsapp: true,
              avatarUrl: true,
              agencyName: true,
            },
          },
        },
      });

      if (!property) return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
      return NextResponse.json({ property });
    }

    const search = searchParams.get('search') || '';
    const propType = searchParams.get('type') || '';
    const transaction = searchParams.get('transaction') || '';
    const neighborhood = searchParams.get('neighborhood') || '';
    const city = searchParams.get('city') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const realtorId = searchParams.get('realtorId');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { neighborhood: { contains: search } },
        { city: { contains: search } },
        { address: { contains: search } },
      ];
    }

    if (propType && propType !== 'ALL') where.propertyType = propType;
    if (transaction && transaction !== 'ALL') {
      where.OR = [{ transactionType: transaction }, { transactionType: 'BOTH' }];
    }
    if (neighborhood) where.neighborhood = { contains: neighborhood };
    if (city) where.city = { contains: city };
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (realtorId) where.realtorId = realtorId;
    if (featured === 'true') where.featured = true;

    const properties = await prisma.property.findMany({
      where,
      include: {
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            creci: true,
            whatsapp: true,
            avatarUrl: true,
            agencyName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ properties });
  }

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

  // POST /api/portal/properties
  if (type === 'properties') {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORRETOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const body = await req.json();

    const {
      title,
      description,
      price,
      rentPrice,
      transactionType,
      propertyType,
      address,
      neighborhood,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      suites,
      parkingSpaces,
      areaTotal,
      areaBuilt,
      condoFee,
      iptuFee,
      featured,
      images,
      videoUrl,
      virtualTourUrl,
      amenities,
    } = body;

    if (!title || !description || !price || !transactionType || !propertyType || !address || !neighborhood || !city) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newProperty = await prisma.property.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        rentPrice: rentPrice ? parseFloat(rentPrice) : null,
        transactionType,
        propertyType,
        address,
        neighborhood,
        city,
        state: state || 'PB',
        zipCode,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        suites: parseInt(suites) || 0,
        parkingSpaces: parseInt(parkingSpaces) || 0,
        areaTotal: parseFloat(areaTotal) || 0,
        areaBuilt: areaBuilt ? parseFloat(areaBuilt) : null,
        condoFee: condoFee ? parseFloat(condoFee) : null,
        iptuFee: iptuFee ? parseFloat(iptuFee) : null,
        featured: Boolean(featured),
        images: Array.isArray(images) ? JSON.stringify(images) : typeof images === 'string' ? images : '[]',
        videoUrl,
        virtualTourUrl,
        amenities: Array.isArray(amenities) ? JSON.stringify(amenities) : typeof amenities === 'string' ? amenities : '[]',
        realtorId: user.id,
      },
    });

    return NextResponse.json({ success: true, property: newProperty });
  }

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
  const { searchParams } = new URL(req.url);

  // PUT /api/portal/properties
  if (type === 'properties') {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID necessário.' }, { status: 400 });

    const body = await req.json();
    const updated = await prisma.property.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, property: updated });
  }

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const { searchParams } = new URL(req.url);

  // DELETE /api/portal/properties
  if (type === 'properties') {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID necessário.' }, { status: 400 });

    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
}
