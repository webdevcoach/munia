/**
 * POST /api/posts/:postId/comments
 * - Allows an authenticated user to comment on a post specified
 * by the :postId.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { FindCommentResult } from 'types';
import { commentWriteSchema } from '@/lib/validations/comment';
import { z } from 'zod';
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { convertMentionUsernamesToIds } from '@/lib/convertMentionUsernamesToIds';
import { mentionsActivityLogger } from '@/lib/mentionsActivityLogger';

export async function POST(
  request: Request,
  { params }: { params: { postId: string } },
) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;
  const postId = parseInt(params.postId);

  try {
    const body = await request.json();
    let { content } = commentWriteSchema.parse(body);
    const { str, usersMentioned } = await convertMentionUsernamesToIds({
      str: content,
    });
    content = str;

    const res: FindCommentResult = await prisma.comment.create({
      data: {
        content,
        userId: userId,
        postId,
      },
      include: includeToComment(userId),
    });

    // Record a 'CREATE_COMMENT' activity
    // Find the owner of the post
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });
    await prisma.activity.create({
      data: {
        type: 'CREATE_COMMENT',
        sourceId: res.id,
        sourceUserId: user.id,
        targetId: postId,
        targetUserId: post?.userId,
      },
    });

    // Log the 'COMMENT_MENTION' activity if applicable
    await mentionsActivityLogger({
      usersMentioned,
      activity: {
        type: 'COMMENT_MENTION',
        sourceUserId: userId,
        sourceId: res.id,
        targetId: res.postId,
      },
      isUpdate: false,
    });

    return NextResponse.json(await toGetComment(res));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
