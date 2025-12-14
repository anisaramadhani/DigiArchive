import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const npm = formData.get('npm') as string;

    if (!photo || !npm) {
      return NextResponse.json({ 
        error: 'Photo and NPM are required' 
      }, { status: 400 });
    }

    // Convert photo to buffer
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const ext = photo.name.split('.').pop();
    const filename = `profile-${npm}-${timestamp}.${ext}`;
    
    // Save to public/images directory
    const publicPath = path.join(process.cwd(), 'public', 'images', filename);
    await writeFile(publicPath, buffer);

    // Update database
    const { db } = await connectToDatabase();
    const photoUrl = `/images/${filename}`;
    
    await db.collection('users').updateOne(
      { npm: npm.toString() },
      { 
        $set: { 
          foto: photoUrl,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      message: 'Photo uploaded successfully',
      photoUrl: photoUrl
    }, { status: 200 });

  } catch (err) {
    console.error('Upload photo error:', err);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve profile photo
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const npm = url.searchParams.get('npm');

    if (!npm) {
      return NextResponse.json({ 
        error: 'NPM required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ npm: npm.toString() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      foto: user.foto || null
    }, { status: 200 });

  } catch (err) {
    console.error('Get photo error:', err);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
