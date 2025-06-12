import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, children, className = '' }) => {
  return (
    <div className={className}>
      {label && (
        <Text as="label" htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          {label}
        </Text>
      )}
      {children}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FormField;