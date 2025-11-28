import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { npm, password } = body;

    if (!npm || !password) {
      return NextResponse.json({ error: 'NPM dan Password harus diisi' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user by NPM
    const user = await db.collection('users').findOne({ npm: npm.toString() });

    if (!user) {
      return NextResponse.json({ error: 'NPM atau Password salah' }, { status: 401 });
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json({ error: 'NPM atau Password salah' }, { status: 401 });
    }

    // Generate token
    const token = 'token-' + Date.now() + '-' + Math.random().toString(36).slice(2);

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
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ 
      error: 'Gagal terhubung ke database. Pastikan MongoDB berjalan.' 
    }, { status: 500 });
  }
}
