import { NextResponse } from 'next/server';
import { readQuestions, writeQuestions } from '@/lib/blob';
import type { Question } from '@/lib/types';

export async function GET() {
  try {
    const questions = await readQuestions();
    return NextResponse.json(questions);
  } catch (err) {
    console.error('[GET /api/questions]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const questions = await readQuestions();
  const newQuestion: Question = {
    id: `q_${Date.now()}`,
    text: body.text,
    options: body.options,
    correctOption: body.correctOption,
    category: body.category || 'geral',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  questions.push(newQuestion);
  await writeQuestions(questions);
  return NextResponse.json(newQuestion, { status: 201 });
}
