import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon.jsx';
import { habitService, habitCompletionService, userProgressService } from '../services/index.js';

const Progress = () => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

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
      return {
        date: dateStr,
        completions: dayCompletions,
        habits: habits.length
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

  const renderHeatmap = () => {
    const { streakData } = getProgressStats();
    const maxCompletions = Math.max(...streakData.map(d => d.completions), 1);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {streakData.map((day, index) => {
          const intensity = day.completions / maxCompletions;
          
          return (
            <motion.div
              key={day.date}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`w-4 h-4 rounded-sm ${
                intensity === 0
                  ? 'bg-surface-200 dark:bg-surface-700'
                  : intensity < 0.5
                  ? 'bg-secondary/30'
                  : intensity < 0.8
                  ? 'bg-secondary/60'
                  : 'bg-secondary'
              }`}
              title={`${format(new Date(day.date), 'MMM d')} - ${day.completions} habits completed`}
            />
          );
        })}
      </div>
    );
  };

  const xpToNextLevel = userProgress ? (userProgress.level * 100) - userProgress.totalXP : 0;
  const levelProgress = userProgress ? ((userProgress.totalXP % 100) / 100) * 100 : 0;

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
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Something went wrong
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
          <button
            onClick={loadProgressData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { totalCompletions, thisWeekCompletions } = getProgressStats();
  const habitPerformance = getHabitPerformance();

  if (habits.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="TrendingUp" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-2">
            No progress to show yet
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Create some habits and start tracking your progress to see your journey unfold.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
            onClick={() => window.location.href = '/habits'}
          >
            Create Your First Habit
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
            Your Progress
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track your journey and celebrate your wins
          </p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-blue-600 rounded-card p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Level {userProgress?.level || 1}</h3>
              <p className="text-blue-100">{userProgress?.totalXP || 0} XP</p>
            </div>
            <ApperIcon name="Zap" className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{100 - xpToNextLevel} XP to go</span>
            </div>
            <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2">
              <motion.div
                className="bg-white rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Total Completions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                Total Completions
              </h3>
              <p className="text-surface-600 dark:text-surface-400">All time</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-secondary" />
          </div>
          <div className="text-3xl font-bold text-surface-900 dark:text-surface-50">
            {totalCompletions}
          </div>
        </motion.div>

        {/* This Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                This Week
              </h3>
              <p className="text-surface-600 dark:text-surface-400">Weekly streak: {userProgress?.weeklyStreak || 0}</p>
            </div>
            <ApperIcon name="Calendar" className="w-8 h-8 text-accent" />
          </div>
          <div className="text-3xl font-bold text-surface-900 dark:text-surface-50">
            {thisWeekCompletions}
          </div>
        </motion.div>
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
          Activity Heatmap
        </h3>
        <p className="text-surface-600 dark:text-surface-400 mb-6 text-sm">
          Your habit completion activity over the last 30 days
        </p>
        {renderHeatmap()}
      </motion.div>

      {/* Habit Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card"
      >
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-6">
          Habit Performance
        </h3>
        
        <div className="space-y-4">
          {habitPerformance.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                  {habit.name}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                  <span>{habit.totalCompletions} completions</span>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Flame" className="w-4 h-4 text-orange-500" />
                    <span>{habit.currentStreak} day streak</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-surface-900 dark:text-surface-50">
                    {habit.completionRate}%
                  </div>
                  <div className="text-xs text-surface-500 dark:text-surface-400">
                    Success rate
                  </div>
                </div>
                
                <div className="w-16 h-2 bg-surface-200 dark:bg-surface-600 rounded-full">
                  <motion.div
                    className={`h-2 rounded-full ${
                      habit.completionRate >= 80 ? 'bg-secondary' :
                      habit.completionRate >= 60 ? 'bg-accent' : 'bg-orange-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${habit.completionRate}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      {userProgress?.badges && userProgress.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card"
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-6">
            Achievements
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {userProgress.badges.map((badgeId, index) => {
              const badge = badges[badgeId];
              if (!badge) return null;
              
              return (
                <motion.div
                  key={badgeId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name={badge.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-surface-900 dark:text-surface-50 text-sm mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-surface-600 dark:text-surface-400">
                    {badge.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Progress;