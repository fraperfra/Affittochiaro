import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import './styles/design-tokens.css';
import './styles/custom.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            // PWA/Mobile optimization: ensure toast is below header and notch
            className: 'mt-safe-top pt-16 md:pt-0',
            duration: 2000,
            style: {
              background: '#fff',
              color: '#2C3E50',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              padding: '12px 16px',
              maxWidth: '90vw', // Prevent too wide on mobile
            },
            success: {
              iconTheme: {
                primary: '#00C48C',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF5A5F',
                secondary: '#fff',
              },
            },
          }}
          containerStyle={{
            top: 80, // Push down below header (64px) + some buffer
            left: 20,
            bottom: 20,
            right: 20,
          }}
        />
      </BrowserRouter>
      <SpeedInsights />
    </ErrorBoundary>
  </React.StrictMode>
);
