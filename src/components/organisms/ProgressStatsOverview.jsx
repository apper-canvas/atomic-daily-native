import React from 'react';
import PropTypes from 'prop-types';
import StatCard from '@/components/molecules/StatCard';
import Text from '@/components/atoms/Text';

const ProgressStatsOverview = ({ userProgress, totalCompletions, thisWeekCompletions }) => {
  const xpToNextLevel = userProgress ? (userProgress.level * 100) - userProgress.totalXP : 0;
  const levelProgress = userProgress ? ((userProgress.totalXP % 100) / 100) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title={`Level ${userProgress?.level || 1}`}
        value={`${userProgress?.totalXP || 0} XP`}
        subtitle="Current Level"
        iconName="Zap"
        iconColorClass="text-white"
        progressBarPercentage={levelProgress}
        progressBarColorClass="bg-white"
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
        className="bg-gradient-to-br from-primary to-blue-600 text-white"
      />

      <StatCard
        title="Total Completions"
        value={totalCompletions}
        subtitle="All time"
        iconName="CheckCircle"
        iconColorClass="text-secondary"
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 } }}
      />

      <StatCard
        title="This Week"
        value={thisWeekCompletions}
        subtitle={`Weekly streak: ${userProgress?.weeklyStreak || 0}`}
        iconName="Calendar"
        iconColorClass="text-accent"
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 } }}
      />
    </div>
  );
};

ProgressStatsOverview.propTypes = {
  userProgress: PropTypes.object,
  totalCompletions: PropTypes.number.isRequired,
  thisWeekCompletions: PropTypes.number.isRequired,
};

export default ProgressStatsOverview;