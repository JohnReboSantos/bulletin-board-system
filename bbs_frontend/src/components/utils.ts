import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from '../stores/RootStore';

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

export const useIsPoster = () => {
  const rootStore = useStore();

  const getPosters = useCallback(async () => {
    try {
      await rootStore.posters.getPosters();
    } catch (error) {
      console.error('Error getting posters:', error);
    }
  }, [rootStore.posters]);

  useEffect(() => {
    getPosters();
  }, [getPosters]);

  const memoizedPosters = useMemo(
    () => rootStore.posters.posters,
    [rootStore.posters.posters],
  );

  const isPoster = useCallback(
    (userId: number) => {
      const poster = memoizedPosters.find((poster) => poster.user === userId);
      return poster ? true : false;
    },
    [memoizedPosters],
  );

  return isPoster;
};

export const useIsAdmin = () => {
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
