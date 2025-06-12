import React, { useState, useEffect } from 'react';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import NoContentMessage from '@/components/molecules/NoContentMessage';
import ProgressStatsOverview from '@/components/organisms/ProgressStatsOverview';
import ActivityHeatmap from '@/components/organisms/ActivityHeatmap';
import HabitPerformanceSection from '@/components/organisms/HabitPerformanceSection';
import AchievementsSection from '@/components/organisms/AchievementsSection';

import { habitService, habitCompletionService, userProgressService } from '@/services/index.js';

const ProgressPage = () => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const badges = {
    first_habit: { name: 'First Steps', icon: 'Target', description: 'Created your first habit' },
    week_warrior: { name: 'Week Warrior', icon: 'Calendar', description: 'Completed habits for 7 days straight' },
    streak_master: { name: 'Streak Master', icon: 'Flame', description: 'Maintained a 30-day streak' },
    early_bird: { name: 'Early Bird', icon: 'Sun', description: 'Completed morning habits consistently' },
    consistency_champion: { name: 'Consistency Champion', icon: 'Award', description: 'Completed 100 habits total' }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, completionsData, progressData] = await Promise.all([
        habitService.getAll(),
        habitCompletionService.getAll(),
        userProgressService.getProgress()
      ]);
      
      setHabits(habitsData);
      setCompletions(completionsData);
      setUserProgress(progressData);
    } catch (err) {
      setError('Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getProgressStats = () => {
    if (!completions.length) return { totalCompletions: 0, thisWeekCompletions: 0, streakData: [] };
    
    const totalCompletions = completions.filter(c => c.completed).length;
    
    // This week completions
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const thisWeekCompletions = completions.filter(c => {
      const date = new Date(c.date);
      return c.completed && date >= weekStart && date <= weekEnd;
    }).length;

    // Streak data for chart
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    const streakData = last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(c => c.date === dateStr && c.completed).length;
      const totalHabitsForDay = habits.length; // Assuming habits array is consistent for all days, adjust if needed
      return {
        date: dateStr,
        completions: dayCompletions,
        habits: totalHabitsForDay,
        intensity: totalHabitsForDay > 0 ? (dayCompletions / totalHabitsForDay) : 0, // Calculate intensity for heatmap
      };
    });

    return { totalCompletions, thisWeekCompletions, streakData };
  };

  const getHabitPerformance = () => {
    return habits.map(habit => {
      const habitCompletions = completions.filter(c => c.habitId === habit.id && c.completed);
      const totalDays = Math.max(1, Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)));
      const completionRate = Math.round((habitCompletions.length / totalDays) * 100);
      
      return {
        ...habit,
        completionRate,
        totalCompletions: habitCompletions.length
      };
    }).sort((a, b) => b.completionRate - a.completionRate);
  };

  const { totalCompletions, thisWeekCompletions, streakData } = getProgressStats();
  const habitPerformance = getHabitPerformance();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card">
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Something went wrong
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400 mb-4">{error}</Text>
          <Button
            onClick={loadProgressData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <NoContentMessage
        iconName="TrendingUp"
        title="No progress to show yet"
        description="Create some habits and start tracking your progress to see your journey unfold."
        buttonText="Create Your First Habit"
        onButtonClick={() => window.location.href = '/habits'}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        &lt;div&gt;
          <Text as="h1" className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
            Your Progress
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400">
            Track your journey and celebrate your wins
          </Text>
        &lt;/div&gt;
      </div>

      <ProgressStatsOverview
        userProgress={userProgress}
        totalCompletions={totalCompletions}
        thisWeekCompletions={thisWeekCompletions}
      />

      <ActivityHeatmap
        streakData={streakData}
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 } }}
      />

      <HabitPerformanceSection
        habitPerformance={habitPerformance}
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 } }}
      />

      <AchievementsSection
        userBadges={userProgress?.badges}
        badgesConfig={badges}
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 } }}
      />
    </div>
  );
};

export default ProgressPage;