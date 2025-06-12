import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout.jsx';
import { routes, routeArray } from '@/config/routes.js';
import NotFoundPage from '@/components/pages/NotFoundPage.jsx';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/today" replace />} />
            {routeArray.map(route => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
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