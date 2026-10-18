import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Sólo subset latin: los kanji/kana decorativos usan Yuji Syuku recortada (styles/index.css)
import '@fontsource/dela-gothic-one/latin-400.css';
import '@fontsource/zen-kaku-gothic-new/latin-400.css';
import '@fontsource/zen-kaku-gothic-new/latin-700.css';
import '@fontsource/jetbrains-mono/latin-500.css';
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
