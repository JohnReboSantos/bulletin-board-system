import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores/RootStore';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import BoardPage from './components/BoardPage';
import ThreadPage from './components/ThreadPage';
import ProfilePage from './components/ProfilePage';

function App() {
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

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      {memoizedBoards.map((board) => (
        <Route
          key={board.id}
          path={`/board${board.id}`}
          element={<BoardPage board={board} />}
        />
      ))}

      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default observer(App);
