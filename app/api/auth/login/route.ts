import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { npm, password } = body;

    if (!npm || !password) {
      return NextResponse.json({ error: 'NPM and password are required' }, { status: 400 });
    }

    // Demo behaviour: accept any non-empty credentials and return a demo token
    // (Replace with real auth logic in production)
    const token = 'demo-token-' + Math.random().toString(36).slice(2, 10);

    return NextResponse.json({ ok: true, token }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
