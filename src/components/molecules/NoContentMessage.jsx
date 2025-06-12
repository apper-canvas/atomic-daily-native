import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const NoContentMessage = ({ iconName, title, description, buttonText, onButtonClick }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12 max-w-md mx-auto"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto mb-4" />
      </motion.div>
      <Text as="h3" className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-2">
        {title}
      </Text>
      <Text as="p" className="text-surface-600 dark:text-surface-400 mb-6">
        {description}
      </Text>
      {buttonText && onButtonClick && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onButtonClick}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
        >
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

NoContentMessage.propTypes = {
  iconName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default NoContentMessage;