import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request, { params }: { params: { studentId: string } }) {
  await apiRequest(`/clear-history/${params.studentId}`, { method: 'POST' });
  return NextResponse.json({ message: 'History cleared successfully' });
}
