import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const HabitListItem = ({ habit, completion, identityGoal, onToggleCompletion, onOpenTinyWin, motionProps }) => {
  return (
    <Card
      as="li"
      motionProps={motionProps}
      className={`hover:shadow-card-hover transition-all ${
        completion.completed ? 'ring-2 ring-secondary' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleCompletion(habit)}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            completion.completed
              ? 'bg-secondary border-secondary text-white'
              : 'border-surface-300 dark:border-surface-600 hover:border-secondary'
          }`}
        >
          {completion.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className="w-5 h-5" />
            </motion.div>
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <Text
            as="h3"
            className={`font-medium ${
              completion.completed
                ? 'text-surface-500 dark:text-surface-400 line-through'
                : 'text-surface-900 dark:text-surface-50'
            }`}
          >
            {habit.name}
          </Text>
          {identityGoal && (
            <Text as="p" className="text-sm text-surface-600 dark:text-surface-400">
              {identityGoal.statement}
            </Text>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-orange-500">
            <ApperIcon name="Flame" className="w-4 h-4" />
            <Text as="span" className="text-sm font-medium">{habit.currentStreak}</Text>
          </div>
          
          <Button
            onClick={() => onOpenTinyWin(habit)}
            className={`p-2 rounded-lg transition-colors ${
              completion.tinyWin
                ? 'text-accent bg-amber-50 dark:bg-amber-900/20'
                : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
            }`}
          >
            <ApperIcon name="PenTool" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {completion.tinyWin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700"
        >
          <div className="flex items-start space-x-2">
            <ApperIcon name="Star" className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <Text as="p" className="text-sm text-surface-600 dark:text-surface-400 italic">
              {completion.tinyWin}
            </Text>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

HabitListItem.propTypes = {
  habit: PropTypes.object.isRequired,
  completion: PropTypes.object.isRequired,
  identityGoal: PropTypes.object,
  onToggleCompletion: PropTypes.func.isRequired,
  onOpenTinyWin: PropTypes.func.isRequired,
  motionProps: PropTypes.object,
};

export default HabitListItem;