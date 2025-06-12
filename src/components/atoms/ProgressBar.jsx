import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProgressBar = ({ percentage, colorClass = 'bg-white', heightClass = 'h-2', className = '' }) => {
  return (
    <div className={`w-full bg-blue-400 bg-opacity-30 rounded-full ${heightClass} ${className}`}>
      <motion.div
        className={`${colorClass} rounded-full ${heightClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  colorClass: PropTypes.string,
  heightClass: PropTypes.string,
  className: PropTypes.string,
};

export default ProgressBar;