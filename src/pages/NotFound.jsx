import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon.jsx';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ApperIcon name="MapPin" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-6xl font-display font-bold text-surface-900 dark:text-surface-50 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/today')}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
          >
            Go to Today
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg font-medium hover:bg-surface-200 dark:hover:bg-surface-600 transition-all"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;