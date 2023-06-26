import { useCallback, useEffect, useMemo } from 'react';
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

export const useIsAdmin = () => {
  const rootStore = useStore();

  const memoizedAdmins = useMemo(
    () => rootStore.administrators.administrators,
    [rootStore.administrators.administrators],
  );

  const isAdmin = useCallback(
    (userId: number) => {
      const admin = memoizedAdmins.find((admin) => admin.user === userId);
      return admin ? true : false;
    },
    [memoizedAdmins],
  );

  return isAdmin;
};

export const useIsAdminOrMod = () => {
  const rootStore = useStore();

  const getAdministrators = useCallback(async () => {
    try {
      await rootStore.administrators.getAdministrators();
    } catch (error) {
      console.error('Error getting admins:', error);
    }
  }, [rootStore.administrators]);

  useEffect(() => {
    getAdministrators();
  }, [getAdministrators]);

  const memoizedAdmins = useMemo(
    () => rootStore.administrators.administrators,
    [rootStore.administrators.administrators],
  );

  const getModerators = useCallback(async () => {
    try {
      await rootStore.moderators.getModerators();
    } catch (error) {
      console.error('Error getting mods:', error);
    }
  }, [rootStore.moderators]);

  useEffect(() => {
    getModerators();
  }, [getModerators]);

  const memoizedMods = useMemo(
    () => rootStore.moderators.moderators,
    [rootStore.moderators.moderators],
  );

  const isAdminOrMod = useCallback(
    (userId: number) => {
      const admin = memoizedAdmins.find((admin) => admin.user === userId);
      const mod = memoizedMods.find((mod) => mod.user === userId);
      return admin || mod ? true : false;
    },
    [memoizedAdmins, memoizedMods],
  );

  return isAdminOrMod;
};
