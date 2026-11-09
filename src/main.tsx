import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Sólo subset latin (incluye Á, Ñ)
import '@fontsource/anton/latin-400.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/pixelify-sans/latin-500.css';
import '@fontsource/caveat-brush/latin-400.css';
import './styles/index.css';
import { LangProvider } from './i18n/LangContext';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
);
