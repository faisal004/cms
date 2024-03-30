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
    //get the course ID here and then fetch from DB the collection name
    const recentMessages = JSON.parse(history);
    let slicedRecentMessages;
    if (recentMessages.length > 6) {
      slicedRecentMessages = recentMessages.slice(recentMessages.length - 6);
    } else {
      slicedRecentMessages = recentMessages;
    }
    const answer = await answerRetrieval(
      question,
      collectionName,
      slicedRecentMessages,
    );

    return NextResponse.json({ answer });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
