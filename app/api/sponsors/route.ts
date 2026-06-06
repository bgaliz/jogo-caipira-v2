import { NextResponse } from 'next/server';
import { readSponsors, writeSponsors } from '@/lib/blob';
import type { Sponsor } from '@/lib/types';

export async function GET() {
  const sponsors = await readSponsors();
  return NextResponse.json(sponsors);
}

export async function POST(request: Request) {
  const body = await request.json();
  const sponsors = await readSponsors();
  const newSponsor: Sponsor = {
    id: `sp_${Date.now()}`,
    name: body.name,
    imageUrl: body.imageUrl,
    displayOnScreens: body.displayOnScreens || ['between_questions'],
    order: sponsors.length + 1,
    active: true,
    createdAt: new Date().toISOString(),
  };
  sponsors.push(newSponsor);
  await writeSponsors(sponsors);
  return NextResponse.json(newSponsor, { status: 201 });
}
