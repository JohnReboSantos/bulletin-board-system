import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';
import {
  useGetBoards,
  useGetThreads,
  useGetUsers,
  useGetBoardName,
} from './components/utils';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import BoardPage from './components/BoardPage';
import ThreadPage from './components/ThreadPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const threads = useGetThreads();
  const boards = useGetBoards();
  const users = useGetUsers();
  const getBoardName = useGetBoardName();

  return (
    <Routes>
      <Route path="/" element={<HomePage boards={boards} />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      {boards.map((board) => (
        <Route
          key={board.id}
          path={`/board_${board.name}`}
          element={<BoardPage board={board} />}
        />
      ))}
      {threads.map((thread) => (
        <Route
          key={thread.id}
          path={`/board_${getBoardName(thread.board)}/thread_${thread.title}`}
          element={<ThreadPage thread={thread} />}
        />
      ))}
      {users.map((user) => (
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
