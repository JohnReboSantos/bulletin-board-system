import { useCallback, useMemo } from 'react';
import { useStore } from '../stores/RootStore';

export const useGetBoardName = () => {
  const rootStore = useStore();

  const memoizedBoards = useMemo(
    () => rootStore.boards.boards,
    [rootStore.boards.boards],
  );

  const getBoardName = useCallback(
    (boardId: number) => {
      const board = memoizedBoards.find((board) => board.id === boardId);
      return board ? board.name : '';
    },
    [memoizedBoards],
  );

  return getBoardName;
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

export const useGetUsername = () => {
  const rootStore = useStore();

  const memoizedUsers = useMemo(
    () => rootStore.users.users,
    [rootStore.users.users],
  );

  const getUsername = useCallback(
    (userId: number) => {
      const user = memoizedUsers.find((user) => user.id === userId);
      return user ? user.username : '';
    },
    [memoizedUsers],
  );

  return getUsername;
};
