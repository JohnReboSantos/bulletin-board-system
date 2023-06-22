import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';
import { createRootStore, StoreProvider } from './stores/RootStore';
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import BoardPage from './components/BoardPage';
import ThreadPage from './components/ThreadPage';
import ProfilePage from './components/ProfilePage';

const rootStore = createRootStore();

function App() {
  return (
    <StoreProvider value={rootStore}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/thread" element={<ThreadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </StoreProvider>
  );
}

export default observer(App);
