import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1000,
            style: {
              background: '#fff',
              color: '#2C3E50',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '12px 16px',
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
        />
      </BrowserRouter>
      <SpeedInsights />
    </ErrorBoundary>
  </React.StrictMode>
);
