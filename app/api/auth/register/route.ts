import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';

async function connectDB() {
  if (mongoose.connections[0]?.readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { nama, email, npm, jurusan, password, password_confirmation } = body;

    // Validasi input
    if (!nama || !email || !npm || !jurusan || !password || !password_confirmation) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Check password match
    if (password !== password_confirmation) {
      return NextResponse.json(
        { success: false, message: 'Password tidak cocok' },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const existingUserByNpm = await User.findOne({ npm });
    if (existingUserByNpm) {
      return NextResponse.json(
        { success: false, message: 'NPM sudah terdaftar' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      nama,
      email,
      npm,
      jurusan,
      password,
    });

    await newUser.save();

    // Return success without password
    const userResponse = newUser.toObject();
    delete (userResponse as any).password;

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran berhasil! Silakan login',
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error details:', error);
    console.error('Register error stack:', error?.stack);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server', error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
