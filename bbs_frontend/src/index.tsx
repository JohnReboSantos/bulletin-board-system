import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createRootStore, StoreProvider } from './stores/RootStore';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootStore = createRootStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider value={rootStore}>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
