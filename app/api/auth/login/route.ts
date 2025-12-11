import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const startTime = Date.now();
  let npm: string = '';
  
  try {
    const body = await req.json();
    npm = body.npm;
    const { password } = body;

    authLogger.info('Login attempt started', { npm, ip: req.headers.get('x-forwarded-for') || 'unknown' });

    if (!npm || !password) {
      authLogger.warn('Login failed: Missing credentials', { npm: npm || 'empty' });
      return NextResponse.json({ error: 'NPM dan Password harus diisi' }, { status: 400 });
    }

    // Connect to database
    authLogger.debug('Connecting to database', { npm });
    const { db } = await connectToDatabase();
    
    // Find user by NPM
    const user = await db.collection('users').findOne({ npm: npm.toString() });

    if (!user) {
      authLogger.warn('Login failed: User not found', { npm });
      return NextResponse.json({ error: 'NPM atau Password salah' }, { status: 401 });
    }

    // Check password
    if (user.password !== password) {
      authLogger.warn('Login failed: Invalid password', { npm, userId: user._id });
      return NextResponse.json({ error: 'NPM atau Password salah' }, { status: 401 });
    }

    // Generate token
    const token = 'token-' + Date.now() + '-' + Math.random().toString(36).slice(2);

    const duration = Date.now() - startTime;
    authLogger.info('Login successful', { 
      npm, 
      userName: user.name,
      userId: user._id,
      duration: `${duration}ms`
    });

    return NextResponse.json({ 
      ok: true, 
      token,
      user: {
        npm: user.npm,
        name: user.name,
        nama: user.name,
        email: user.email,
        jurusan: user.jurusan || '-'
      }
    }, { status: 200 });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    authLogger.error('Login error: Database connection failed', err, { 
      npm,
      duration: `${duration}ms`,
      errorMessage: err?.message
    });
    return NextResponse.json({ 
      error: 'Gagal terhubung ke database. Pastikan MongoDB berjalan.' 
    }, { status: 500 });
  }
}
