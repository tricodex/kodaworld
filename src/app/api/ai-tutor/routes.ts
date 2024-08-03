// src/app/api/ai-tutor/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request) {
  const { message, studentId } = await request.json();

  const data = await apiRequest('/ai-tutor', {
    method: 'POST',
    body: JSON.stringify({ message, studentId }),
  });

  return NextResponse.json(data);
}

