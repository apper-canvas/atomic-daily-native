import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', motionProps, as = 'div', ...props }) => {
  const Component = motion[as] || as;
  
  const filteredProps = { ...props };
  delete filteredProps.as;
  delete filteredProps.motionProps;

  return (
    <Component
      className={`bg-white dark:bg-surface-800 rounded-card p-6 shadow-card ${className}`}
      {...motionProps}
      {...filteredProps}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  motionProps: PropTypes.object, // For framer-motion props
  as: PropTypes.oneOf(['div', 'li', 'article', 'section']), // Allow rendering as different HTML tags
};

export default Card;