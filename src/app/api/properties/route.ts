import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

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
    const type = searchParams.get('type') || '';
    const transaction = searchParams.get('transaction') || '';
    const neighborhood = searchParams.get('neighborhood') || '';
    const city = searchParams.get('city') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const suites = searchParams.get('suites');
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

    if (type && type !== 'ALL') where.propertyType = type;
    if (transaction && transaction !== 'ALL') {
      where.OR = [
        { transactionType: transaction },
        { transactionType: 'BOTH' },
      ];
    }
    if (neighborhood) where.neighborhood = { contains: neighborhood };
    if (city) where.city = { contains: city };
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (suites) where.suites = { gte: parseInt(suites) };
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
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóveis.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao cadastrar imóvel.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID necessário.' }, { status: 400 });

    const body = await req.json();
    const updated = await prisma.property.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao atualizar imóvel.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID necessário.' }, { status: 400 });

    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao excluir imóvel.' }, { status: 500 });
  }
}
