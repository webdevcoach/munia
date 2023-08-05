import { fetchReplies } from '@/lib/query-functions/fetchReplies';
import { useQuery } from '@tanstack/react-query';
import { CommentReply } from './CommentReply';
import { useSession } from 'next-auth/react';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';

export function CommentReplies({ parentId }: { parentId: number }) {
  const { data: session } = useSession();
  const queryKey = ['comments', parentId, 'replies'];
  const {
    data: replies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchReplies({ parentId }),
    staleTime: 60000 * 10,
  });
  const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
  const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });

  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p>Error loading comments.</p>;
  return (
    <div>
      {replies.map((reply) => (
        <CommentReply
          key={`comments-${parentId}-replies-${reply.id}`}
          {...reply}
          {...{ handleEdit, handleDelete, likeComment, unLikeComment }}
          isOwnReply={session?.user.id === reply.user.id}
        />
      ))}
    </div>
  );
}