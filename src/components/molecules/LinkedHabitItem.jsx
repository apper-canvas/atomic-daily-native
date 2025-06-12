import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const LinkedHabitItem = ({ habit }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-secondary rounded-full"></div>
        <Text as="span" className="text-surface-900 dark:text-surface-50">
          {habit.name}
        </Text>
      </div>
      <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
        <ApperIcon name="Flame" className="w-4 h-4 text-orange-500" />
        <Text as="span">{habit.currentStreak} day streak</Text>
      </div>
    </div>
  );
};

LinkedHabitItem.propTypes = {
  habit: PropTypes.object.isRequired,
};

export default LinkedHabitItem;