import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores/RootStore';
import { Routes, Route } from 'react-router-dom';
import { useGetBoardName } from './components/utils';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import BoardPage from './components/BoardPage';
import ThreadPage from './components/ThreadPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const rootStore = useStore();
  const getBoardName = useGetBoardName();

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

  return (
    <Routes>
      <Route path="/" element={<HomePage boards={memoizedBoards} />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      {memoizedBoards.map((board) => (
        <Route
          key={board.id}
          path={`/board_${board.name}`}
          element={<BoardPage board={board} />}
        />
      ))}
      {memoizedThreads.map((thread) => (
        <Route
          key={thread.id}
          path={`/board_${getBoardName(parseInt(thread.board))}/thread_${
            thread.title
          }`}
          element={<ThreadPage thread={thread} />}
        />
      ))}
      {memoizedUsers.map((user) => (
        <Route
          key={user.id}
          path={`/user_${user.id}`}
          element={<ProfilePage user={user} />}
        />
      ))}
    </Routes>
  );
}

export default observer(App);
