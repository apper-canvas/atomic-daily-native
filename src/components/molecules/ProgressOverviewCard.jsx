import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import ProgressBar from '@/components/atoms/ProgressBar';
import Text from '@/components/atoms/Text';

const ProgressOverviewCard = ({ completedHabits, totalHabits, percentage, motionProps }) => {
  return (
    <Card
      motionProps={motionProps}
      className="bg-gradient-to-r from-primary to-secondary text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <Text as="h2" className="text-lg font-semibold">Today's Progress</Text>
          <Text as="p" className="text-blue-100">
            {completedHabits} of {totalHabits} habits completed
          </Text>
        </div>
        <div className="text-right">
          <Text as="div" className="text-3xl font-bold">{Math.round(percentage)}%</Text>
          <Text as="div" className="text-sm text-blue-100">Complete</Text>
        </div>
      </div>
      <ProgressBar percentage={percentage} />
    </Card>
  );
};

ProgressOverviewCard.propTypes = {
  completedHabits: PropTypes.number.isRequired,
  totalHabits: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
  motionProps: PropTypes.object,
};

export default ProgressOverviewCard;