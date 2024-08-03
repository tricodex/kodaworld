#!/bin/bash

# Create conversation-history route
mkdir -p app/api/conversation-history/\[studentId\]
cat << EOF > app/api/conversation-history/\[studentId\]/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function GET(request: Request, { params }: { params: { studentId: string } }) {
  const data = await apiRequest(\`/conversation-history/\${params.studentId}\`);
  return NextResponse.json(data);
}
EOF

# Create clear-history route
mkdir -p app/api/clear-history/\[studentId\]
cat << EOF > app/api/clear-history/\[studentId\]/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request, { params }: { params: { studentId: string } }) {
  await apiRequest(\`/clear-history/\${params.studentId}\`, { method: 'POST' });
  return NextResponse.json({ message: 'History cleared successfully' });
}
EOF

# Create collect-feedback route
mkdir -p app/api/collect-feedback/\[studentId\]
cat << EOF > app/api/collect-feedback/\[studentId\]/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function POST(request: Request, { params }: { params: { studentId: string } }) {
  const { feedback } = await request.json();
  await apiRequest(\`/collect-feedback/\${params.studentId}\`, {
    method: 'POST',
    body: JSON.stringify({ feedback }),
  });
  return NextResponse.json({ message: 'Feedback collected successfully' });
}
EOF

# Create learning-progress route
mkdir -p app/api/learning-progress/\[studentId\]
cat << EOF > app/api/learning-progress/\[studentId\]/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function GET(request: Request, { params }: { params: { studentId: string } }) {
  const data = await apiRequest(\`/learning-progress/\${params.studentId}\`);
  return NextResponse.json(data);
}
EOF

# Create next-steps route
mkdir -p app/api/next-steps/\[studentId\]
cat << EOF > app/api/next-steps/\[studentId\]/route.ts
import { NextResponse } from 'next/server';
import { apiRequest } from '@/utils/apiUtils';

export async function GET(request: Request, { params }: { params: { studentId: string } }) {
  const data = await apiRequest(\`/next-steps/\${params.studentId}\`);
  return NextResponse.json(data);
}
EOF

echo "All new route files have been created successfully."