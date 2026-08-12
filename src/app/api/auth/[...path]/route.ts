import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, getCurrentUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const action = path[0];

  // POST /api/auth/login
  if (action === 'login') {
    try {
      const { email, password } = await req.json();

      if (!email || !password) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
      }

      if (user.status === 'BLOCKED') {
        return NextResponse.json({ error: 'Esta conta está suspensa.' }, { status: 403 });
      }

      const token = signToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as any,
        creci: user.creci,
        agencyName: user.agencyName,
        avatarUrl: user.avatarUrl,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          creci: user.creci,
          agencyName: user.agencyName,
          avatarUrl: user.avatarUrl,
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
      return NextResponse.json({ error: 'Erro no login.' }, { status: 500 });
    }
  }

  // POST /api/auth/register
  if (action === 'register') {
    try {
      const { name, email, password, role, creci, phone, whatsapp, agencyName, bio } = await req.json();

      if (!name || !email || !password) {
        return NextResponse.json({ error: 'Nome, email e senha são obrigatórios.' }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

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
      return NextResponse.json({ error: 'Erro no cadastro.' }, { status: 500 });
    }
  }

  // POST /api/auth/logout
  if (action === 'logout') {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('imoveis_auth_token');
    return response;
  }

  return NextResponse.json({ error: 'Rota não encontrada.' }, { status: 404 });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const action = path[0];

  // GET /api/auth/me
  if (action === 'me') {
    const session = await getCurrentUser();
    if (!session) return NextResponse.json({ user: null });

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

  return NextResponse.json({ error: 'Rota não encontrada.' }, { status: 404 });
}
