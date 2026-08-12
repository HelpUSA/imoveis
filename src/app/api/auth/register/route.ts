import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, creci, phone, whatsapp, agencyName, bio } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Já existe uma conta com este e-mail.' }, { status: 400 });
    }

    const userRole = role === 'CORRETOR' ? 'CORRETOR' : 'CLIENT';
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: passwordHash,
        role: userRole,
        creci: userRole === 'CORRETOR' ? creci : null,
        phone,
        whatsapp,
        agencyName: userRole === 'CORRETOR' ? agencyName : null,
        bio: userRole === 'CORRETOR' ? bio : null,
        status: 'ACTIVE',
      },
    });

    const token = signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      creci: newUser.creci,
      agencyName: newUser.agencyName,
      avatarUrl: newUser.avatarUrl,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        creci: newUser.creci,
        agencyName: newUser.agencyName,
        avatarUrl: newUser.avatarUrl,
      },
    });

    response.cookies.set('imoveis_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar conta.' }, { status: 500 });
  }
}
