import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ActivityHeatmapCalendar from '@/components/molecules/ActivityHeatmapCalendar';

const ActivityHeatmap = ({ streakData, motionProps }) => {
  return (
    <Card motionProps={motionProps}>
      <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
        Activity Heatmap
      </Text>
      <Text as="p" className="text-surface-600 dark:text-surface-400 mb-6 text-sm">
        Your habit completion activity over the last 30 days
      </Text>
      <ActivityHeatmapCalendar heatmapData={streakData} cellClassName="w-4 h-4" />
    </Card>
  );
};

ActivityHeatmap.propTypes = {
  streakData: PropTypes.arrayOf(PropTypes.object).isRequired,
  motionProps: PropTypes.object,
};

export default ActivityHeatmap;