import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from localStorage (stored as user object)
    // In production, verify JWT token and get user ID from it
    
    // For now, we'll get NPM from token (simple approach)
    // Token format: "token-timestamp-randomstring"
    // We need to store user info when login, so let's check localStorage approach
    
    // Since this is a server-side API, we can't access localStorage
    // Better approach: decode token or pass user identifier
    
    // Let's use a simple approach: pass NPM in header or query
    const url = new URL(req.url);
    const npm = url.searchParams.get('npm');
    
    if (!npm) {
      return NextResponse.json({ 
        error: 'NPM required. Pass ?npm=xxx in query string' 
      }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user by NPM
    const user = await db.collection('users').findOne({ npm: npm.toString() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data (exclude password)
    return NextResponse.json({
      user: {
        nama: user.name,
        email: user.email,
        npm: user.npm,
        jurusan: user.jurusan || '-',
        foto: user.foto || null,
        created_at: user.createdAt,
      }
    }, { status: 200 });

  } catch (err) {
    console.error('Get user error:', err);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
