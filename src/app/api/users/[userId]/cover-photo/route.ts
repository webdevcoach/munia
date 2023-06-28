import { NextResponse } from 'next/server';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  return await useUpdateProfileAndCoverPhoto(request, user, 'coverPhoto');
}