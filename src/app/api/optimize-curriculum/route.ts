// src/app/api/optimize-curriculum/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { currentCurriculum, performanceData, learningGoals } = await request.json();

  const response = await fetch('http://localhost:8000/api/optimize-curriculum', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentCurriculum, performanceData, learningGoals }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}