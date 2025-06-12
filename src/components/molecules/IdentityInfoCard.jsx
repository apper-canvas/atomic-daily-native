import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const IdentityInfoCard = ({ motionProps }) => {
  return (
    <Card
      motionProps={motionProps}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-start space-x-3">
        <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div>
          <Text as="h3" className="font-semibold text-primary mb-2">Identity-Based Habits</Text>
          <Text as="p" className="text-surface-700 dark:text-surface-300">
            Instead of focusing on what you want to achieve, focus on who you want to become. 
            Every action you take is a vote for the type of person you wish to be.
          </Text>
        </div>
      </div>
    </Card>
  );
};

IdentityInfoCard.propTypes = {
  motionProps: PropTypes.object,
};

export default IdentityInfoCard;