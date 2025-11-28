import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get total arsip for this user
    const totalArsip = await db.collection('arsip').countDocuments({ 
      npm: npm.toString(),
      deleted: { $ne: true }
    });

    // Get arsip hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalArsipHariIni = await db.collection('arsip').countDocuments({
      npm: npm.toString(),
      deleted: { $ne: true },
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get arsip bulan ini
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const arsipBulanIni = await db.collection('arsip').countDocuments({
      npm: npm.toString(),
      deleted: { $ne: true },
      createdAt: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    });

    return NextResponse.json({
      totalArsip,
      totalArsipHariIni,
      arsipBulanIni
    }, { status: 200 });

  } catch (err) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json({ 
      error: 'Gagal mengambil data dashboard' 
    }, { status: 500 });
  }
}
