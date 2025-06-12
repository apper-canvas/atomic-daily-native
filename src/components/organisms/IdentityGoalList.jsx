import React from 'react';
import PropTypes from 'prop-types';
import IdentityGoalDisplayCard from '@/components/molecules/IdentityGoalDisplayCard';
import NoContentMessage from '@/components/molecules/NoContentMessage';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const IdentityGoalList = ({ identityGoals, habits, onDeleteGoal, onAddGoalClick }) => {
  const getLinkedHabits = (goalId) => {
    return habits.filter(habit => habit.identityGoalId === goalId);
  };

  if (identityGoals.length === 0) {
    return (
      <NoContentMessage
        iconName="User"
        title="Define your identity"
        description="Start by creating identity goals that represent who you want to become."
        buttonText="Create Your First Identity Goal"
        onButtonClick={onAddGoalClick}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {identityGoals.map((goal, index) => (
        <IdentityGoalDisplayCard
          key={goal.id}
          goal={goal}
          linkedHabits={getLinkedHabits(goal.id)}
          onDeleteGoal={onDeleteGoal}
          motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 } }}
        />
      ))}
    </ul>
  );
};

IdentityGoalList.propTypes = {
  identityGoals: PropTypes.arrayOf(PropTypes.object).isRequired,
  habits: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteGoal: PropTypes.func.isRequired,
  onAddGoalClick: PropTypes.func.isRequired,
};

export default IdentityGoalList;