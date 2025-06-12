import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import ProgressBar from '@/components/atoms/ProgressBar';

const StatCard = ({ title, value, subtitle, iconName, iconColorClass, progressBarPercentage, progressBarColorClass, motionProps, className = '' }) => {
  return (
    <Card motionProps={motionProps} className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50">
            {title}
          </Text>
          {subtitle && (
            <Text as="p" className="text-surface-600 dark:text-surface-400">
              {subtitle}
            </Text>
          )}
        </div>
        {iconName && (
          <ApperIcon name={iconName} className={`w-8 h-8 ${iconColorClass}`} />
        )}
      </div>
      <Text as="div" className="text-3xl font-bold text-surface-900 dark:text-surface-50">
        {value}
      </Text>
      {progressBarPercentage !== undefined && (
        <div className="space-y-2 mt-4">
          <Text as="div" className="flex justify-between text-sm text-surface-500 dark:text-surface-400">
            <span>Progress to next level</span>
            <span>{100 - value} XP to go</span> {/* This specific text should be passed as a prop */}
          </Text>
          <ProgressBar percentage={progressBarPercentage} colorClass={progressBarColorClass} />
        </div>
      )}
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  iconName: PropTypes.string,
  iconColorClass: PropTypes.string,
  progressBarPercentage: PropTypes.number,
  progressBarColorClass: PropTypes.string,
  motionProps: PropTypes.object,
  className: PropTypes.string,
};

export default StatCard;