import { NextRequest, NextResponse } from 'next/server';
import { answerRetrieval } from './core';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    const { question, collectionName, history } = await req.json();
    const recentMessages = JSON.parse(history).slice(0, -1).slice(0, 12);
    console.log(recentMessages, question);
    const answer = await answerRetrieval(
      question,
      collectionName,
      recentMessages,
    );

    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
