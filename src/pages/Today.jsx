import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon.jsx';
import { habitService, habitCompletionService, identityGoalService, userProgressService } from '../services/index.js';

const motivationalQuotes = [
  "Every action you take is a vote for the type of person you wish to become.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Success is the product of daily habits—not once-in-a-lifetime transformations.",
  "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.",
  "Small changes often appear to make no difference until you cross a critical threshold."
];

const Today = () => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [identityGoals, setIdentityGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [tinyWin, setTinyWin] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

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
      
      setHabits(habitsData);
      setCompletions(completionsData);
      setIdentityGoals(goalsData);
    } catch (err) {
      setError('Failed to load today\'s habits');
      toast.error('Failed to load today\'s habits');
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
        // Award XP for completion
        await userProgressService.addXP(10);
        
        // Update streak
        const streakData = await habitCompletionService.getStreakData(habit.id);
        await habitService.updateStreak(habit.id, streakData.currentStreak);
        
        toast.success(`Great job! Habit completed.`, {
          icon: '🎉'
        });
      }
    } catch (err) {
      // Revert optimistic update
      loadTodayData();
      toast.error('Failed to update habit');
    }
  };

  const openTinyWinModal = (habit) => {
    const completion = getHabitCompletion(habit.id);
    setSelectedHabit(habit);
    setTinyWin(completion.tinyWin || '');
  };

  const saveTinyWin = async () => {
    if (!selectedHabit) return;

    try {
      const currentCompletion = getHabitCompletion(selectedHabit.id);
      
      await habitCompletionService.update(selectedHabit.id, today, {
        completed: currentCompletion.completed,
        tinyWin: tinyWin.trim()
      });

      // Update local state
      const updatedCompletions = completions.filter(c => c.habitId !== selectedHabit.id);
      updatedCompletions.push({
        habitId: selectedHabit.id,
        date: today,
        completed: currentCompletion.completed,
        tinyWin: tinyWin.trim()
      });
      setCompletions(updatedCompletions);

      setSelectedHabit(null);
      setTinyWin('');
      toast.success('Tiny win saved!');
    } catch (err) {
      toast.error('Failed to save tiny win');
    }
  };

  const completedHabits = habits.filter(habit => getHabitCompletion(habit.id).completed).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
          <div className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-surface-100 dark:bg-surface-700 rounded-lg"></div>
              ))}
            </div>
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
            onClick={loadTodayData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

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
            <ApperIcon name="Target" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Ready to start building habits?
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Create your first habit and begin your journey to becoming the person you want to be.
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
          {todayFormatted}
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Today is a new opportunity to become who you want to be
        </p>
      </div>

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

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-50 dark:bg-surface-800 rounded-card p-6 border-l-4 border-accent"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Quote" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <p className="text-surface-700 dark:text-surface-300 font-medium italic">
            "{todayQuote}"
          </p>
        </div>
      </motion.div>

      {/* Habits List */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50">
          Today's Habits
        </h2>
        
        <div className="space-y-3">
          {habits.map((habit, index) => {
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
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-orange-500">
                      <ApperIcon name="Flame" className="w-4 h-4" />
                      <span className="text-sm font-medium">{habit.currentStreak}</span>
                    </div>
                    
                    <button
                      onClick={() => openTinyWinModal(habit)}
                      className={`p-2 rounded-lg transition-colors ${
                        completion.tinyWin
                          ? 'text-accent bg-amber-50 dark:bg-amber-900/20'
                          : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                      }`}
                    >
                      <ApperIcon name="PenTool" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {completion.tinyWin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700"
                  >
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Star" className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-surface-600 dark:text-surface-400 italic">
                        {completion.tinyWin}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tiny Win Modal */}
      <AnimatePresence>
        {selectedHabit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedHabit(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-surface-800 rounded-card shadow-xl max-w-md w-full p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ApperIcon name="Star" className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                    Celebrate Your Tiny Win
                  </h3>
                </div>
                
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  What went well with "{selectedHabit.name}" today?
                </p>
                
                <textarea
                  value={tinyWin}
                  onChange={(e) => setTinyWin(e.target.value)}
                  placeholder="I felt energized after completing this habit..."
                  className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg resize-none h-24 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={200}
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-surface-500">
                    {tinyWin.length}/200
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedHabit(null)}
                      className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveTinyWin}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save Win
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Today;