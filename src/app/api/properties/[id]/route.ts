import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const property = await prisma.property.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
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
      return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
    }

    // Increment views asynchronously
    await prisma.property.update({
      where: { id: property.id },
      data: { viewsCount: { increment: 1 } },
    });

    return NextResponse.json({ property });
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Erro ao carregar detalhes do imóvel.' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && property.realtorId !== user.id) {
      return NextResponse.json({ error: 'Você só pode editar seus próprios imóveis.' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.rentPrice !== undefined && { rentPrice: body.rentPrice ? parseFloat(body.rentPrice) : null }),
        ...(body.transactionType && { transactionType: body.transactionType }),
        ...(body.propertyType && { propertyType: body.propertyType }),
        ...(body.address && { address: body.address }),
        ...(body.neighborhood && { neighborhood: body.neighborhood }),
        ...(body.city && { city: body.city }),
        ...(body.bedrooms !== undefined && { bedrooms: parseInt(body.bedrooms) }),
        ...(body.bathrooms !== undefined && { bathrooms: parseInt(body.bathrooms) }),
        ...(body.suites !== undefined && { suites: parseInt(body.suites) }),
        ...(body.parkingSpaces !== undefined && { parkingSpaces: parseInt(body.parkingSpaces) }),
        ...(body.areaTotal !== undefined && { areaTotal: parseFloat(body.areaTotal) }),
        ...(body.status && { status: body.status }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        ...(body.images && { images: Array.isArray(body.images) ? JSON.stringify(body.images) : body.images }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.amenities && { amenities: Array.isArray(body.amenities) ? JSON.stringify(body.amenities) : body.amenities }),
      },
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Erro ao atualizar imóvel.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && property.realtorId !== user.id) {
      return NextResponse.json({ error: 'Você só pode excluir seus próprios imóveis.' }, { status: 403 });
    }

    await prisma.property.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Erro ao excluir imóvel.' }, { status: 500 });
  }
}
