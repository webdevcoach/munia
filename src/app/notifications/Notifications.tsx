'use client';

import useOnScreen from '@/hooks/useOnScreen';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { GetActivity } from 'types';
import { Activity } from '../../components/Activity';
import { AllCaughtUp } from '../../components/AllCaughtUp';
import { useSession } from 'next-auth/react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { useNotificationsReadStatusMutations } from '@/hooks/mutations/useNotificationsReadStatusMutations';
import { ACTIVITIES_PER_PAGE } from '@/constants';

export function Notifications() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { markAllAsReadMutation } = useNotificationsReadStatusMutations();

  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    fetchPreviousPage,
    refetch,
  } = useInfiniteQuery<
    GetActivity[],
    Error,
    InfiniteData<GetActivity[], unknown>,
    QueryKey,
    number
  >({
    queryKey: ['users', userId, 'notifications'],
    defaultPageParam: 0,
    queryFn: async ({ pageParam, direction }) => {
      const isForwards = direction === 'forward';
      const params = new URLSearchParams('');
      params.set('limit', ACTIVITIES_PER_PAGE.toString());
      params.set('cursor', pageParam.toString());
      params.set('sort-direction', isForwards ? 'desc' : 'asc');

      const res = await fetch(
        `/api/users/${userId}/notifications?${params.toString()}`,
      );
      if (!res.ok) {
        throw new Error('Failed to load notifications.');
      }

      const activities = (await res.json()) as GetActivity[];

      // Prevent React Query from 'prepending' the data with an empty array
      if (!activities.length && !isForwards) {
        throw new Error('No data loaded.');
      }

      // If the direction is backwards, `activities` need to be reversed
      // to make sure that the latest activity is shown at the top
      return isForwards ? activities : activities.reverse();
    },
    getNextPageParam: (lastPage, pages) => {
      // If the `pages` `length` is 0, that means there is not a single activity to load
      if (pages.length === 0) return undefined;

      // If the last page doesn't have activities, that means the end is reached
      if (lastPage.length === 0) return undefined;

      // Return the `id` of the last activity, this will serve as the cursor
      // that will be passed to `queryFn` as the `pageParam` property
      return lastPage.slice(-1)[0].id;
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.length) return 0;
      return firstPage[0].id;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
    enabled: !!userId,
  });

  useEffect(() => {
    if (!isBottomOnScreen) return;
    if (!data) return;
    if (!hasNextPage) return;

    fetchNextPage();
  }, [isBottomOnScreen]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPreviousPage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => markAllAsReadMutation.mutate();

  return (
    <div>
      <div className="flex justify-between">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-4xl font-bold">Notifications</h1>
        </div>
        <DropdownMenu>
          <DropdownItem onClick={markAllAsRead}>Mark all as read</DropdownItem>
        </DropdownMenu>
      </div>
      <div>
        {data?.pages.flat().map((activity) => {
          return <Activity key={activity.id} {...activity} />;
        })}
      </div>

      <div
        className="h-6"
        ref={bottomElRef}
        /**
         * The first page will be initially loaded by React Query
         * so the bottom loader has to be hidden first
         */
        style={{ display: data ? 'block' : 'none' }}
      ></div>
      {!isFetchingNextPage && !hasNextPage && <AllCaughtUp />}
    </div>
  );
}