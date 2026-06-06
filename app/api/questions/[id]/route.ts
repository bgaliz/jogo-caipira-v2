import { NextResponse } from 'next/server';
import { readQuestions, writeQuestions } from '@/lib/blob';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const questions = await readQuestions();
  const idx = questions.findIndex((q) => q.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  questions[idx] = { ...questions[idx], ...body, updatedAt: new Date().toISOString() };
  await writeQuestions(questions);
  return NextResponse.json(questions[idx]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const questions = await readQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  await writeQuestions(filtered);
  return NextResponse.json({ success: true });
}
