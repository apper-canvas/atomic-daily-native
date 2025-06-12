import React from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import BadgeCard from '@/components/molecules/BadgeCard';

const AchievementsSection = ({ userBadges, badgesConfig, motionProps }) => {
  if (!userBadges || userBadges.length === 0) {
    return null;
  }

  return (
    <Card motionProps={motionProps}>
      <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-6">
        Achievements
      </Text>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {userBadges.map((badgeId, index) => {
          const badge = badgesConfig[badgeId];
          if (!badge) return null;
          
          return (
            <BadgeCard key={badgeId} badge={badge} index={index} />
          );
        })}
      </div>
    </Card>
  );
};

AchievementsSection.propTypes = {
  userBadges: PropTypes.arrayOf(PropTypes.string),
  badgesConfig: PropTypes.object.isRequired,
  motionProps: PropTypes.object,
};

export default AchievementsSection;