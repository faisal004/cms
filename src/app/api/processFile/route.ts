import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseVtt, storeToDB } from './core';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const { url } = await req.json();
    //parse the blob file and get the textual data
    const extractedText = await parseVtt(url);

    // store it to vector DB - Qdrant DB

    await storeToDB(extractedText);

    // update the db with the vector store collection

    return NextResponse.json(
      { message: 'File processed successfully' },
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
