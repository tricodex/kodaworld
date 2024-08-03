// src/app/api/ai-tutor/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message, studentId } = await request.json();

  const response = await fetch('http://localhost:8000/api/ai-tutor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, studentId }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

