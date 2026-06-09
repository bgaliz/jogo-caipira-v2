import { put, del, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import type { Question, Sponsor } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function localRead<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return defaultValue;
  }
}

function localWrite(filename: string, data: unknown): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

export async function readQuestions(): Promise<Question[]> {
  if (useBlob()) {
    try {
      const { blobs } = await list({ prefix: 'pds/questions.json' });
      if (blobs.length === 0) return localRead<Question[]>('questions.json', []);
      const sorted = blobs.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      const res = await fetch(sorted[0].url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
      return res.json();
    } catch (err) {
      console.error('[readQuestions] blob failed, falling back to local:', err);
      return localRead<Question[]>('questions.json', []);
    }
  }
  return localRead<Question[]>('questions.json', []);
}

export async function writeQuestions(questions: Question[]): Promise<void> {
  if (useBlob()) {
    await put('pds/questions.json', JSON.stringify(questions), {
      contentType: 'application/json',
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } else if (process.env.VERCEL) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set — cannot write on Vercel without Blob storage');
  } else {
    localWrite('questions.json', questions);
  }
}

export async function readSponsors(): Promise<Sponsor[]> {
  if (useBlob()) {
    try {
      const { blobs } = await list({ prefix: 'pds/sponsors.json' });
      if (blobs.length === 0) return localRead<Sponsor[]>('sponsors.json', []);
      const sorted = blobs.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      const res = await fetch(sorted[0].url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
      return res.json();
    } catch (err) {
      console.error('[readSponsors] blob failed, falling back to local:', err);
      return localRead<Sponsor[]>('sponsors.json', []);
    }
  }
  return localRead<Sponsor[]>('sponsors.json', []);
}

export async function writeSponsors(sponsors: Sponsor[]): Promise<void> {
  if (useBlob()) {
    await put('pds/sponsors.json', JSON.stringify(sponsors), {
      contentType: 'application/json',
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } else if (process.env.VERCEL) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not set — cannot write on Vercel without Blob storage');
  } else {
    localWrite('sponsors.json', sponsors);
  }
}

export async function uploadSponsorImage(
  file: File | Blob,
  filename: string
): Promise<string> {
  if (useBlob()) {
    const blob = await put(`pds/sponsors/${filename}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return blob.url;
  }
  // Local: save to public/sponsors/
  const sponsorsDir = path.join(process.cwd(), 'public', 'sponsors');
  if (!fs.existsSync(sponsorsDir)) fs.mkdirSync(sponsorsDir, { recursive: true });
  const buffer = Buffer.from(await (file as Blob).arrayBuffer());
  const localFilename = `${Date.now()}-${filename}`;
  fs.writeFileSync(path.join(sponsorsDir, localFilename), buffer);
  return `/sponsors/${localFilename}`;
}

export async function deleteSponsorImage(url: string): Promise<void> {
  if (useBlob() && url.includes('blob.vercel-storage.com')) {
    await del(url);
  } else if (!useBlob() && url.startsWith('/sponsors/')) {
    const filePath = path.join(process.cwd(), 'public', url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}
