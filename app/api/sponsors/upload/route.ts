import { NextResponse } from 'next/server';
import { uploadSponsorImage } from '@/lib/blob';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  const url = await uploadSponsorImage(file, file.name);
  return NextResponse.json({ url });
}
