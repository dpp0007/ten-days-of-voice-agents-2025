import { NextResponse } from 'next/server';
import catalog from './catalog.json';

export async function GET() {
  return NextResponse.json(catalog);
}
