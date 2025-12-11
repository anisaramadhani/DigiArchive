import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * API untuk initialize collection arsip
 * Endpoint: GET /api/admin/init-db
 * 
 * Fungsi:
 * 1. Membuat collection arsip jika belum ada
 * 2. Membuat indexes untuk performa
 * 3. Insert sample data (optional)
 */
export async function GET(req: Request) {
  try {
    console.log('🔧 Initializing database...');
    
    const { db } = await connectToDatabase();
    
    // 1. Cek apakah collection arsip sudah ada
    const collections = await db.listCollections({ name: 'arsip' }).toArray();
    const arsipExists = collections.length > 0;
    
    console.log(`📋 Collection 'arsip' ${arsipExists ? 'already exists' : 'does not exist'}`);
    
    // 2. Jika belum ada, buat collection
    if (!arsipExists) {
      await db.createCollection('arsip');
      console.log('✅ Collection arsip created');
    }
    
    // 3. Buat indexes untuk performa
    await db.collection('arsip').createIndexes([
      { key: { npm: 1 }, name: 'npm_index' },
      { key: { createdAt: -1 }, name: 'createdAt_index' },
      { key: { deleted: 1 }, name: 'deleted_index' },
      { key: { category: 1 }, name: 'category_index' }
    ]);
    console.log('✅ Indexes created');
    
    // 4. Cek jumlah dokumen
    const count = await db.collection('arsip').countDocuments();
    console.log(`📊 Total documents in arsip: ${count}`);
    
    // 5. Jika kosong, insert sample data (optional)
    if (count === 0) {
      const sampleDoc = {
        npm: '0000000000000',
        title: 'Sample Document - Welcome to DigiArchive',
        category: 'Lainnya',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 transparent pixel
        fileName: 'sample.txt',
        fileType: 'text/plain',
        deleted: false,
        sharedWith: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('arsip').insertOne(sampleDoc);
      console.log('✅ Sample document inserted');
    }
    
    // 6. Cek collection users
    const usersCollections = await db.listCollections({ name: 'users' }).toArray();
    const usersExists = usersCollections.length > 0;
    console.log(`📋 Collection 'users' ${usersExists ? 'exists' : 'does not exist'}`);
    
    // 7. Final check - list all collections
    const allCollections = await db.listCollections().toArray();
    const collectionNames = allCollections.map(c => c.name);
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      database: 'digiarchive',
      collections: collectionNames,
      arsip: {
        exists: true,
        documentsCount: await db.collection('arsip').countDocuments(),
        indexes: await db.collection('arsip').indexes()
      },
      users: {
        exists: usersExists,
        documentsCount: usersExists ? await db.collection('users').countDocuments() : 0
      }
    }, { status: 200 });
    
  } catch (err: any) {
    console.error('❌ Database initialization error:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
