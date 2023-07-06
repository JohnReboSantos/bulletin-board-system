import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from '../stores/RootStore';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const convertToHumanizedTimestamp = (dateString: string) => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const useGetPosts = () => {
  const rootStore = useStore();

  const getPosts = useCallback(async () => {
    try {
      await rootStore.posts.getPosts();
    } catch (error) {
      console.error('Error getting posts:', error);
    }
  }, [rootStore.posts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const memoizedPosts = useMemo(
    () => rootStore.posts.posts,
    [rootStore.posts.posts],
  );

  return memoizedPosts;
};

export const useGetThreads = () => {
  const rootStore = useStore();

  const getThreads = useCallback(async () => {
    try {
      await rootStore.threads.getThreads();
    } catch (error) {
      console.error('Error getting threads:', error);
    }
  }, [rootStore.threads]);

  useEffect(() => {
    getThreads();
  }, [getThreads]);

  const memoizedThreads = useMemo(
    () => rootStore.threads.threads,
    [rootStore.threads.threads],
  );

  return memoizedThreads;
};

export const useGetBoards = () => {
  const rootStore = useStore();

  const getBoards = useCallback(async () => {
    try {
      await rootStore.boards.getBoards();
    } catch (error) {
      console.error('Error getting boards:', error);
    }
  }, [rootStore.boards]);

  useEffect(() => {
    getBoards();
  }, [getBoards]);

  const memoizedBoards = useMemo(
    () => rootStore.boards.boards,
    [rootStore.boards.boards],
  );

  return memoizedBoards;
};

export const useGetUsers = () => {
  const rootStore = useStore();

  const getUsers = useCallback(async () => {
    try {
      await rootStore.users.getUsers();
    } catch (error) {
      console.error('Error getting users:', error);
    }
  }, [rootStore.users]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const memoizedUsers = useMemo(
    () => rootStore.users.users,
    [rootStore.users.users],
  );

  return memoizedUsers;
};

export const useGetThreadTitle = () => {
  const rootStore = useStore();

  const memoizedThreads = useMemo(
    () => rootStore.threads.threads,
    [rootStore.threads.threads],
  );

  const getThreadTitle = useCallback(
    (threadId: number) => {
      const thread = memoizedThreads.find((thread) => thread.id === threadId);
      return thread ? thread.title : '';
    },
    [memoizedThreads],
  );

  return getThreadTitle;
};

export const useGetBoardName = () => {
  const boards = useGetBoards();

  const getBoardName = useCallback(
    (boardId: number) => {
      const board = boards.find((board) => board.id === boardId);
      return board ? board.name : '';
    },
    [boards],
  );

  return getBoardName;
};

export const useGetUsername = () => {
  const users = useGetUsers();

  const getUsername = useCallback(
    (userId: number) => {
      const user = users.find((user) => user.id === userId);
      return user ? user.username : '';
    },
    [users],
  );

  return getUsername;
};

export const getSortedThreads = (
  filteredThreads: {
    id: number;
    title: string;
    board: number;
    createdBy: number;
    createdAt: string;
    locked: boolean;
    sticky: boolean;
  }[],
  posts: {
    id: number;
    thread: number;
    createdBy: number;
    createdAt: string;
    message: string;
  }[],
) => {
  const threadsWithPosts = filteredThreads.filter((thread) =>
    posts.some((post) => post.thread === thread.id),
  );
  const threadsWithoutPosts = filteredThreads.filter(
    (thread) => !posts.some((post) => post.thread === thread.id),
  );
  const sortedThreadsWithPosts = threadsWithPosts.sort((a, b) => {
    const postsA = posts.filter((post) => post.thread === a.id);
    const postsB = posts.filter((post) => post.thread === b.id);
    const sortedPostsA = postsA.sort(
      (post1, post2) =>
        new Date(post2.createdAt).getTime() -
        new Date(post1.createdAt).getTime(),
    );
    const sortedPostsB = postsB.sort(
      (post1, post2) =>
        new Date(post2.createdAt).getTime() -
        new Date(post1.createdAt).getTime(),
    );
    const mostRecentPostA = sortedPostsA[0];
    const mostRecentPostB = sortedPostsB[0];
    return (
      new Date(mostRecentPostA.createdAt).getTime() -
      new Date(mostRecentPostB.createdAt).getTime()
    );
  });
  const sortedThreadsWithoutPosts = threadsWithoutPosts.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  return [...sortedThreadsWithPosts, ...sortedThreadsWithoutPosts];
};

export const useIsAdmin = () => {
  const users = useGetUsers();

  const isAdmin = useCallback((userId: number) => {
    const admin = users.find((user) => user.id === userId && user.role === 'admin')
    return !!admin;
  }, [users])

  return isAdmin
}

export const useIsMod = () => {
  const users = useGetUsers();

  const isModerator = useCallback((userId: number) => {
    const moderator = users.find((user) => user.id === userId && user.role === 'moderator' || 'admin')
    return !!moderator;
  }, [users])

  return isModerator
}

export const useIsBanned = () => {
  const users = useGetUsers();

  const isBanned = useCallback((userId: number) => {
    const user = users.find((user) => user.id === userId)
    return user?.banned;
  }, [users])

  return isBanned
}
