import React from 'react';
import PropTypes from 'prop-types';
import HabitListItem from '@/components/molecules/HabitListItem';
import Text from '@/components/atoms/Text';

const HabitListSection = ({ habits, completions, identityGoals, onToggleCompletion, onOpenTinyWin }) => {
  if (habits.length === 0) {
    return null; // Handled by HomePage for overall empty state
  }

  const getHabitCompletion = (habitId) => {
    return completions.find(c => c.habitId === habitId) || { completed: false, tinyWin: '' };
  };

  const getIdentityGoal = (goalId) => {
    return identityGoals.find(g => g.id === goalId);
  };

  return (
    <div className="space-y-4">
      <Text as="h2" className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50">
        Today's Habits
      </Text>
      
      <ul className="space-y-3">
        {habits.map((habit, index) => (
          <HabitListItem
            key={habit.id}
            habit={habit}
            completion={getHabitCompletion(habit.id)}
            identityGoal={getIdentityGoal(habit.identityGoalId)}
            onToggleCompletion={onToggleCompletion}
            onOpenTinyWin={onOpenTinyWin}
            motionProps={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 } }}
          />
        ))}
      </ul>
    </div>
  );
};

HabitListSection.propTypes = {
  habits: PropTypes.arrayOf(PropTypes.object).isRequired,
  completions: PropTypes.arrayOf(PropTypes.object).isRequired,
  identityGoals: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleCompletion: PropTypes.func.isRequired,
  onOpenTinyWin: PropTypes.func.isRequired,
};

export default HabitListSection;