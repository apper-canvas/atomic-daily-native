import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon.jsx';
import { habitService, habitCompletionService, identityGoalService } from '../services/index.js';

const MainFeature = () => {
  const [todayHabits, setTodayHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [identityGoals, setIdentityGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, completionsData, goalsData] = await Promise.all([
        habitService.getAll(),
        habitCompletionService.getTodayCompletions(),
        identityGoalService.getAll()
      ]);
      
      setTodayHabits(habitsData);
      setCompletions(completionsData);
      setIdentityGoals(goalsData);
    } catch (err) {
      setError('Failed to load habits');
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const getHabitCompletion = (habitId) => {
    return completions.find(c => c.habitId === habitId) || { completed: false, tinyWin: '' };
  };

  const getIdentityGoal = (goalId) => {
    return identityGoals.find(g => g.id === goalId);
  };

  const toggleHabitCompletion = async (habit) => {
    const currentCompletion = getHabitCompletion(habit.id);
    const newCompleted = !currentCompletion.completed;

    try {
      // Optimistic update
      const updatedCompletions = completions.filter(c => c.habitId !== habit.id);
      if (newCompleted || currentCompletion.tinyWin) {
        updatedCompletions.push({
          habitId: habit.id,
          date: today,
          completed: newCompleted,
          tinyWin: currentCompletion.tinyWin || ''
        });
      }
      setCompletions(updatedCompletions);

      // Update backend
      await habitCompletionService.update(habit.id, today, {
        completed: newCompleted,
        tinyWin: currentCompletion.tinyWin || ''
      });

      if (newCompleted) {
        // Update streak
        const streakData = await habitCompletionService.getStreakData(habit.id);
        await habitService.updateStreak(habit.id, streakData.currentStreak);
        
        toast.success('Habit completed! 🎉');
      }
    } catch (err) {
      // Revert optimistic update
      loadTodayData();
      toast.error('Failed to update habit');
    }
  };

  const completedHabits = todayHabits.filter(habit => getHabitCompletion(habit.id).completed).length;
  const totalHabits = todayHabits.length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-24 bg-surface-200 dark:bg-surface-700 rounded-card mb-6"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
        <button
          onClick={loadTodayData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (todayHabits.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Target" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-2">
          Ready to start?
        </h3>
        <p className="text-surface-600 dark:text-surface-400">
          Create your first habit to begin building positive daily routines.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-card p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Today's Progress</h2>
            <p className="text-blue-100">
              {completedHabits} of {totalHabits} habits completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-blue-100">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2">
          <motion.div
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
          Today's Habits
        </h3>
        
        {todayHabits.slice(0, 3).map((habit, index) => {
          const completion = getHabitCompletion(habit.id);
          const identityGoal = getIdentityGoal(habit.identityGoalId);
          
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-surface-800 rounded-card p-4 shadow-card hover:shadow-card-hover transition-all ${
                completion.completed ? 'ring-2 ring-secondary' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleHabitCompletion(habit)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    completion.completed
                      ? 'bg-secondary border-secondary text-white'
                      : 'border-surface-300 dark:border-surface-600 hover:border-secondary'
                  }`}
                >
                  {completion.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <ApperIcon name="Check" className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.button>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${
                    completion.completed
                      ? 'text-surface-500 dark:text-surface-400 line-through'
                      : 'text-surface-900 dark:text-surface-50'
                  }`}>
                    {habit.name}
                  </h3>
                  {identityGoal && (
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {identityGoal.statement}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-orange-500">
                  <ApperIcon name="Flame" className="w-4 h-4" />
                  <span className="text-sm font-medium">{habit.currentStreak}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {todayHabits.length > 3 && (
          <div className="text-center pt-2">
            <button
              onClick={() => window.location.href = '/today'}
              className="text-primary hover:text-blue-600 font-medium text-sm transition-colors"
            >
              View all {todayHabits.length} habits →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;