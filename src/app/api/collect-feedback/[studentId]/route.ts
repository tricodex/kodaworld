import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request, { params }: { params: { studentId: string } }) {
  const { feedback } = await request.json();
  await apiRequest(`/collect-feedback/${params.studentId}`, {
    method: 'POST',
    body: JSON.stringify({ feedback }),
  });
  return NextResponse.json({ message: 'Feedback collected successfully' });
}
