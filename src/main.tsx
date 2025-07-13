import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'; 
import App from './App.tsx';
import './index.css';

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  </StrictMode>
);
