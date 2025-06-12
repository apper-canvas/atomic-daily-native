import React from 'react';
import PropTypes from 'prop-types';
import HabitDisplayCard from '@/components/molecules/HabitDisplayCard';
import NoContentMessage from '@/components/molecules/NoContentMessage';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const HabitListDisplay = ({ habits, identityGoals, completions, onDeleteHabit, onAddHabitClick }) => {
  const getIdentityGoal = (goalId) => {
    return identityGoals.find(g => g.id === goalId);
  };

  const getHeatmapData = (habitId) => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    return last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const completion = completions.find(c => c.habitId === habitId && c.date === dateStr);
      return {
        date: dateStr,
        completed: completion?.completed || false,
        intensity: completion?.completed ? 1 : 0
      };
    });
  };

  if (habits.length === 0) {
    return (
      <NoContentMessage
        iconName="Target"
        title="No habits yet"
        description="Start building lasting habits by creating your first one."
        buttonText="Create Your First Habit"
        onButtonClick={onAddHabitClick}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {habits.map((habit, index) => (
        <HabitDisplayCard
          key={habit.id}
          habit={habit}
          identityGoal={getIdentityGoal(habit.identityGoalId)}
          heatmapData={getHeatmapData(habit.id)}
          onDeleteHabit={onDeleteHabit}
          motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 } }}
        />
      ))}
    </ul>
  );
};

HabitListDisplay.propTypes = {
  habits: PropTypes.arrayOf(PropTypes.object).isRequired,
  identityGoals: PropTypes.arrayOf(PropTypes.object).isRequired,
  completions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteHabit: PropTypes.func.isRequired,
  onAddHabitClick: PropTypes.func.isRequired,
};

export default HabitListDisplay;