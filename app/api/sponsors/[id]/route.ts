import { NextResponse } from 'next/server';
import { readSponsors, writeSponsors, deleteSponsorImage } from '@/lib/blob';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const sponsors = await readSponsors();
  const idx = sponsors.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  sponsors[idx] = { ...sponsors[idx], ...body };
  await writeSponsors(sponsors);
  return NextResponse.json(sponsors[idx]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sponsors = await readSponsors();
  const sponsor = sponsors.find((s) => s.id === id);
  if (sponsor?.imageUrl) {
    await deleteSponsorImage(sponsor.imageUrl);
  }
  const filtered = sponsors.filter((s) => s.id !== id);
  await writeSponsors(filtered);
  return NextResponse.json({ success: true });
}
