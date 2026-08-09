import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AppStoreMedia from './components/AppStoreMedia.tsx';
import './index.css';

const params = new URLSearchParams(window.location.search);
const showMedia = params.get('media') === '1' || window.location.hash === '#media';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {showMedia ? <AppStoreMedia /> : <App />}
  </StrictMode>
);
