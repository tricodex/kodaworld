import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function GET(request: Request, { params }: { params: { studentId: string } }) {
  const data = await apiRequest(`/learning-progress/${params.studentId}`);
  return NextResponse.json(data);
}
