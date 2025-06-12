import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const BadgeCard = ({ badge, index }) => {
  if (!badge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
        <ApperIcon name={badge.icon} className="w-6 h-6 text-white" />
      </div>
      <Text as="h4" className="font-medium text-surface-900 dark:text-surface-50 text-sm mb-1">
        {badge.name}
      </Text>
      <Text as="p" className="text-xs text-surface-600 dark:text-surface-400">
        {badge.description}
      </Text>
    </motion.div>
  );
};

BadgeCard.propTypes = {
  badge: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default BadgeCard;