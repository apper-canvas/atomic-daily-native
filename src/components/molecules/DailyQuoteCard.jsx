import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DailyQuoteCard = ({ quote, motionProps, className = '' }) => {
  return (
    <Card
      motionProps={motionProps}
      className={`bg-surface-50 dark:bg-surface-800 border-l-4 border-accent ${className}`}
    >
      <div className="flex items-start space-x-3">
        <ApperIcon name="Quote" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
        <Text as="p" className="text-surface-700 dark:text-surface-300 font-medium italic">
          "{quote}"
        </Text>
      </div>
    </Card>
  );
};

DailyQuoteCard.propTypes = {
  quote: PropTypes.string.isRequired,
  motionProps: PropTypes.object,
  className: PropTypes.string,
};

export default DailyQuoteCard;