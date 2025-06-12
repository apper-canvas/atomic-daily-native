import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ActivityHeatmapCalendar from '@/components/molecules/ActivityHeatmapCalendar';

const HabitDisplayCard = ({ habit, identityGoal, heatmapData, onDeleteHabit, motionProps }) => {
  return (
    <Card
      as="li"
      motionProps={motionProps}
      className="hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-1">
            {habit.name}
          </Text>
          {identityGoal && (
            <Text as="p" className="text-surface-600 dark:text-surface-400 text-sm mb-2">
              {identityGoal.statement}
            </Text>
          )}
          <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <Text as="span">{habit.reminderTime}</Text>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Repeat" className="w-4 h-4" />
              <Text as="span" className="capitalize">{habit.frequency}</Text>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onDeleteHabit(habit.id)}
            className="p-2 text-surface-400 hover:text-red-500 transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center space-x-1 text-orange-500">
              <ApperIcon name="Flame" className="w-5 h-5" />
              <Text as="span" className="text-lg font-bold">{habit.currentStreak}</Text>
            </div>
            <Text as="div" className="text-xs text-surface-500 dark:text-surface-400">Current</Text>
          </div>
          
          <div className="text-center">
            <Text as="div" className="text-lg font-bold text-surface-900 dark:text-surface-50">
              {habit.longestStreak}
            </Text>
            <Text as="div" className="text-xs text-surface-500 dark:text-surface-400">Best</Text>
          </div>
        </div>
        
        <div className="flex-1 max-w-xs">
          <Text as="div" className="text-xs text-surface-500 dark:text-surface-400 mb-2 text-right">
            Last 30 days
          </Text>
          <ActivityHeatmapCalendar heatmapData={heatmapData} cellClassName="w-3 h-3" showDaysLabel={false} />
        </div>
      </div>
    </Card>
  );
};

HabitDisplayCard.propTypes = {
  habit: PropTypes.object.isRequired,
  identityGoal: PropTypes.object,
  heatmapData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteHabit: PropTypes.func.isRequired,
  motionProps: PropTypes.object,
};

export default HabitDisplayCard;