import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const HeatmapCell = ({ intensity, title, className = '', index }) => {
  let bgColorClass = 'bg-surface-200 dark:bg-surface-700'; // Default for 0 intensity
  if (intensity > 0) {
    if (intensity &lt; 0.5) {
      bgColorClass = 'bg-secondary/30';
    } else if (intensity &lt; 0.8) {
      bgColorClass = 'bg-secondary/60';
    } else {
      bgColorClass = 'bg-secondary';
    }
  }

  const motionProps = index !== undefined ? {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { delay: index * 0.02 },
  } : {};

  return (
    <motion.div
      className={`w-4 h-4 rounded-sm ${bgColorClass} ${className}`}
      title={title}
      {...motionProps}
    />
  );
};

HeatmapCell.propTypes = {
  intensity: PropTypes.number.isRequired, // 0 to 1
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  index: PropTypes.number, // Optional, for motion delay
};

export default HeatmapCell;