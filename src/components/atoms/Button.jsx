import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, ...props }) => {
  const filteredProps = { ...props };
  // Filter out non-HTML props that should not be passed to the DOM element
  delete filteredProps.as; // Example of a custom prop that might be passed
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      {...filteredProps}
    >
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default Button;