import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon.jsx';
import { habitService, habitCompletionService, identityGoalService } from '../services/index.js';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [identityGoals, setIdentityGoals] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [newHabit, setNewHabit] = useState({
    name: '',
    identityGoalId: '',
    frequency: 'daily',
    reminderTime: '09:00'
  });

  useEffect(() => {
    loadHabitsData();
  }, []);

  const loadHabitsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, goalsData, completionsData] = await Promise.all([
        habitService.getAll(),
        identityGoalService.getAll(),
        habitCompletionService.getAll()
      ]);
      
      setHabits(habitsData);
      setIdentityGoals(goalsData);
      setCompletions(completionsData);
    } catch (err) {
      setError('Failed to load habits');
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async () => {
    if (!newHabit.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }
    
    if (!newHabit.identityGoalId) {
      toast.error('Please select an identity goal');
      return;
    }

    try {
      const createdHabit = await habitService.create(newHabit);
      setHabits([...habits, createdHabit]);
      
      // Link habit to identity goal
      await identityGoalService.addLinkedHabit(newHabit.identityGoalId, createdHabit.id);
      
      setShowAddModal(false);
      setNewHabit({
        name: '',
        identityGoalId: '',
        frequency: 'daily',
        reminderTime: '09:00'
      });
      
      toast.success('Habit created successfully!');
    } catch (err) {
      toast.error('Failed to create habit');
    }
  };

  const deleteHabit = async (habitId) => {
    if (!confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      return;
    }

    try {
      await habitService.delete(habitId);
      setHabits(habits.filter(h => h.id !== habitId));
      
      // Remove from identity goal
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        await identityGoalService.removeLinkedHabit(habit.identityGoalId, habitId);
      }
      
      toast.success('Habit deleted');
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  };

  const getIdentityGoal = (goalId) => {
    return identityGoals.find(g => g.id === goalId);
  };

  const getHeatmapData = (habitId) => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    return last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const completion = completions.find(c => c.habitId === habitId && c.date === dateStr);
      return {
        date: dateStr,
        completed: completion?.completed || false,
        intensity: completion?.completed ? 1 : 0
      };
    });
  };

  const renderHeatmapCalendar = (habitId) => {
    const heatmapData = getHeatmapData(habitId);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {heatmapData.map((day, index) => (
          <div
            key={day.date}
            className={`w-3 h-3 rounded-sm ${
              day.completed
                ? 'bg-secondary'
                : 'bg-surface-200 dark:bg-surface-700'
            }`}
            title={`${format(new Date(day.date), 'MMM d')} - ${day.completed ? 'Completed' : 'Not completed'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card">
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(21)].map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-surface-200 dark:bg-surface-700 rounded-sm"></div>
                  ))}
                </div>
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
            onClick={loadHabitsData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
            Your Habits
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Build consistency and track your progress
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-surface-600 text-primary shadow-sm'
                  : 'text-surface-600 dark:text-surface-400'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-surface-600 text-primary shadow-sm'
                  : 'text-surface-600 dark:text-surface-400'
              }`}
            >
              Calendar
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Habit</span>
          </motion.button>
        </div>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Target" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-2">
            No habits yet
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Start building lasting habits by creating your first one.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
          >
            Create Your First Habit
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit, index) => {
            const identityGoal = getIdentityGoal(habit.identityGoalId);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-1">
                      {habit.name}
                    </h3>
                    {identityGoal && (
                      <p className="text-surface-600 dark:text-surface-400 text-sm mb-2">
                        {identityGoal.statement}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>{habit.reminderTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Repeat" className="w-4 h-4" />
                        <span className="capitalize">{habit.frequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-orange-500">
                        <ApperIcon name="Flame" className="w-5 h-5" />
                        <span className="text-lg font-bold">{habit.currentStreak}</span>
                      </div>
                      <div className="text-xs text-surface-500 dark:text-surface-400">Current</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-surface-900 dark:text-surface-50">
                        {habit.longestStreak}
                      </div>
                      <div className="text-xs text-surface-500 dark:text-surface-400">Best</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="text-xs text-surface-500 dark:text-surface-400 mb-2 text-right">
                      Last 30 days
                    </div>
                    {renderHeatmapCalendar(habit.id)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-surface-800 rounded-card shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
                  Create New Habit
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Habit Name
                    </label>
                    <input
                      type="text"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                      placeholder="e.g., Drink 8 glasses of water"
                      className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Identity Goal
                    </label>
                    <select
                      value={newHabit.identityGoalId}
                      onChange={(e) => setNewHabit({...newHabit, identityGoalId: e.target.value})}
                      className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select an identity goal</option>
                      {identityGoals.map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.statement}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={newHabit.reminderTime}
                      onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                      className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createHabit}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Create Habit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Habits;