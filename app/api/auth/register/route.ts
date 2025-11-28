import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { npm, name, email, password, jurusan } = body;

    // Validasi input
    if (!npm || !name || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Cek apakah user sudah ada
    const existingUser = await db.collection('users').findOne({ 
      $or: [{ npm: npm.toString() }, { email }] 
    });

    if (existingUser) {
      if (existingUser.npm === npm.toString()) {
        return NextResponse.json(
          { error: 'NPM sudah terdaftar' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Insert user baru
    const result = await db.collection('users').insertOne({
      npm: npm.toString(),
      name,
      email,
      password, // TODO: Hash password dengan bcrypt di production
      jurusan: jurusan || '-',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        ok: true,
        message: 'Registrasi berhasil! Silakan login.',
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Gagal terhubung ke database. Pastikan MongoDB berjalan.' },
      { status: 500 }
    );
  }
}
