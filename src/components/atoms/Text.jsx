import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Text = ({ as = 'p', children, className = '', motionProps, ...props }) => {
  const Component = motion[as] || as;

  const filteredProps = { ...props };
  // Filter out non-HTML props that should not be passed to the DOM element
  delete filteredProps.as;
  delete filteredProps.motionProps;

  return (
    <Component className={className} {...motionProps} {...filteredProps}>
      {children}
    </Component>
  );
};

Text.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  motionProps: PropTypes.object, // For framer-motion props
};

export default Text;