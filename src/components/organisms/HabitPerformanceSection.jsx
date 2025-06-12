import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import { motion } from 'framer-motion';

const HabitPerformanceItem = ({ habit, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg"
    >
      <div className="flex-1 min-w-0">
        <Text as="h4" className="font-medium text-surface-900 dark:text-surface-50 mb-1">
          {habit.name}
        </Text>
        <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
          <Text as="span">{habit.totalCompletions} completions</Text>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Flame" className="w-4 h-4 text-orange-500" />
            <Text as="span">{habit.currentStreak} day streak</Text>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <Text as="div" className="text-lg font-bold text-surface-900 dark:text-surface-50">
            {habit.completionRate}%
          </Text>
          <Text as="div" className="text-xs text-surface-500 dark:text-surface-400">
            Success rate
          </Text>
        </div>
        
        <div className="w-16 h-2 bg-surface-200 dark:bg-surface-600 rounded-full">
          <ProgressBar
            percentage={habit.completionRate}
            colorClass={
              habit.completionRate >= 80 ? 'bg-secondary' :
              habit.completionRate >= 60 ? 'bg-accent' : 'bg-orange-400'
            }
            heightClass="h-2"
            className="bg-transparent" // Override default background to prevent double background
          />
        </div>
      </div>
    </motion.div>
  );
};

HabitPerformanceItem.propTypes = {
  habit: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const HabitPerformanceSection = ({ habitPerformance, motionProps }) => {
  return (
    <Card motionProps={motionProps}>
      <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-6">
        Habit Performance
      </Text>
      
      <ul className="space-y-4">
        {habitPerformance.map((habit, index) => (
          <HabitPerformanceItem key={habit.id} habit={habit} index={index} />
        ))}
      </ul>
    </Card>
  );
};

HabitPerformanceSection.propTypes = {
  habitPerformance: PropTypes.arrayOf(PropTypes.object).isRequired,
  motionProps: PropTypes.object,
};

export default HabitPerformanceSection;