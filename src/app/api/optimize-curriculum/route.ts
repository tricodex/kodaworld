// src/app/api/optimize-curriculum/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request) {
  const { currentCurriculum, performanceData, learningGoals } = await request.json();

  const data = await apiRequest('/optimize-curriculum', {
    method: 'POST',
    body: JSON.stringify({ currentCurriculum, performanceData, learningGoals }),
  });

  return NextResponse.json(data);
}