import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { onboardingService } from '@/services/api/onboardingService';
import Layout from '@/Layout.jsx';
import { routes, routeArray } from '@/config/routes.js';
import NotFoundPage from '@/components/pages/NotFoundPage.jsx';
import OnboardingWizard from '@/components/pages/OnboardingWizard.jsx';
import './index.css';

function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(
    onboardingService.isOnboardingCompleted()
  );

  // Listen for onboarding completion changes
  useEffect(() => {
    const checkOnboardingStatus = () => {
      const completed = onboardingService.isOnboardingCompleted();
      setIsOnboardingCompleted(completed);
    };

    // Listen for storage changes (in case onboarding completion is stored in localStorage)
    window.addEventListener('storage', checkOnboardingStatus);
    
    // Listen for custom onboarding completion events
    window.addEventListener('onboardingCompleted', checkOnboardingStatus);

    return () => {
      window.removeEventListener('storage', checkOnboardingStatus);
      window.removeEventListener('onboardingCompleted', checkOnboardingStatus);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors duration-200">
        <Routes>
          {/* Onboarding route - accessible regardless of completion status */}
          <Route path="/onboarding" element={<OnboardingWizard />} />
          
          {/* Main app routes */}
          <Route path="/" element={<Layout />}>
            <Route 
              index 
              element={
                isOnboardingCompleted 
                  ? <Navigate to="/today" replace /> 
                  : <Navigate to="/onboarding" replace />
              } 
            />
            {routeArray.map(route => (
              <Route
                key={route.id}
                path={route.path}
                element={
                  isOnboardingCompleted 
                    ? <route.component />
                    : <Navigate to="/onboarding" replace />
                }
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;