import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon.jsx';
import { routeArray } from './config/routes.js';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-surface-900">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 z-40">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50">
              Atomic Daily
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? 'Sun' : 'Moon'} 
                className="w-5 h-5 text-surface-600 dark:text-surface-400" 
              />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <ApperIcon name="Settings" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface-50 dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex-col">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {routeArray.map(route => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }
                `}
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-full min-h-full">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex-shrink-0 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {routeArray.map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'text-primary' 
                  : 'text-surface-500 dark:text-surface-400'
                }
              `}
            >
              <ApperIcon name={route.icon} className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;