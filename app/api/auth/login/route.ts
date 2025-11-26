import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';

async function connectDB() {
  if (mongoose.connections[0].readyState) {
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
    const { npm, password } = body;

    // Validasi input
    if (!npm || !password) {
      return NextResponse.json(
        { success: false, message: 'NPM dan Password harus diisi' },
        { status: 400 }
      );
    }

    // Cari user berdasarkan NPM
    const user = await User.findOne({ npm });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'NPM atau Password salah' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await (user as any).comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'NPM atau Password salah' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, npm: user.npm, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Return success
    const userResponse = user.toObject();
    delete (userResponse as any).password;

    return NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        token,
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
