import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma/prisma';

export const verifyAccessToPost = async (postId: number) => {
  const [user] = await useProtectApiRoute();
  const count = await prisma.post.count({
    where: {
      id: postId,
      userId: user?.id,
    },
  });

  return count > 0;
};
