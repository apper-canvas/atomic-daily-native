import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', children, maxLength, ...props }) => {
  const commonProps = {
    value,
    onChange,
    placeholder,
    className: `w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 focus:ring-2 focus:ring-primary focus:border-transparent ${className}`,
    ...props,
  };

  if (type === 'textarea') {
    return (
      <textarea
        {...commonProps}
        maxLength={maxLength}
        className={`${commonProps.className} resize-none`}
      />
    );
  }

  if (type === 'select') {
    return (
      <select {...commonProps}>
        {children}
      </select>
    );
  }

  return (
    <input type={type} {...commonProps} maxLength={maxLength} />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node, // For select options
  maxLength: PropTypes.number,
};

export default Input;