import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import LinkedHabitItem from '@/components/molecules/LinkedHabitItem';

const IdentityGoalDisplayCard = ({ goal, linkedHabits = [], onDeleteGoal, motionProps }) => {
  return (
    <Card
      as="li"
      motionProps={motionProps}
      className="hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            {goal.statement}
          </Text>
          <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Target" className="w-4 h-4" />
              <Text as="span">{linkedHabits.length} linked habits</Text>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <Text as="span">Created {new Date(goal.createdAt).toLocaleDateString()}</Text>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => onDeleteGoal(goal.id)}
          className="p-2 text-surface-400 hover:text-red-500 transition-colors"
          title="Delete identity goal"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
      
      {linkedHabits.length > 0 && (
        &lt;div&gt;
          <Text as="h4" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
            Supporting Habits:
          </Text>
          &lt;div className="space-y-2"&gt;
            {linkedHabits.map(habit => (
              &lt;LinkedHabitItem key={habit.id} habit={habit} /&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;
      )}
      
      {linkedHabits.length === 0 && (
        &lt;div className="text-center py-4 text-surface-500 dark:text-surface-400"&gt;
          <Text as="p" className="text-sm">
            No habits linked yet. Create habits that support this identity.
          </Text>
        &lt;/div&gt;
      )}
    </Card>
  );
};

IdentityGoalDisplayCard.propTypes = {
  goal: PropTypes.object.isRequired,
  linkedHabits: PropTypes.arrayOf(PropTypes.object),
  onDeleteGoal: PropTypes.func.isRequired,
  motionProps: PropTypes.object,
};

export default IdentityGoalDisplayCard;