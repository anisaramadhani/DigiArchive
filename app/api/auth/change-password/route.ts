import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { oldPassword, newPassword, confirmPassword, npm } = body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        error: 'Semua field harus diisi' 
      }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        error: 'Password baru dan konfirmasi tidak cocok' 
      }, { status: 400 });
    }

    if (!npm) {
      return NextResponse.json({ 
        error: 'NPM required' 
      }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ npm: npm.toString() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify old password
    if (user.password !== oldPassword) {
      return NextResponse.json({ 
        error: 'Password lama salah' 
      }, { status: 401 });
    }

    // Update password
    await db.collection('users').updateOne(
      { npm: npm.toString() },
      { 
        $set: { 
          password: newPassword,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({ 
      message: 'Password berhasil diubah' 
    }, { status: 200 });

  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
