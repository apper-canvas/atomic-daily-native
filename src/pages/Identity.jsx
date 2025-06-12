import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon.jsx';
import { identityGoalService, habitService } from '../services/index.js';

const Identity = () => {
  const [identityGoals, setIdentityGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const identityExamples = [
    "I am a healthy and energetic person",
    "I am a focused and productive professional", 
    "I am a lifelong learner who grows every day",
    "I am someone who nurtures meaningful relationships",
    "I am a creative person who expresses myself regularly",
    "I am an organized person who lives with intention",
    "I am a calm and mindful person",
    "I am someone who takes care of their mental health",
    "I am a financially responsible person",
    "I am an environmentally conscious person"
  ];

  useEffect(() => {
    loadIdentityData();
  }, []);

  const loadIdentityData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [goalsData, habitsData] = await Promise.all([
        identityGoalService.getAll(),
        habitService.getAll()
      ]);
      
      setIdentityGoals(goalsData);
      setHabits(habitsData);
    } catch (err) {
      setError('Failed to load identity goals');
      toast.error('Failed to load identity goals');
    } finally {
      setLoading(false);
    }
  };

  const createIdentityGoal = async () => {
    if (!newGoal.trim()) {
      toast.error('Please enter an identity statement');
      return;
    }

    try {
      const createdGoal = await identityGoalService.create({
        statement: newGoal.trim()
      });
      
      setIdentityGoals([...identityGoals, createdGoal]);
      setShowAddModal(false);
      setNewGoal('');
      toast.success('Identity goal created!');
    } catch (err) {
      toast.error('Failed to create identity goal');
    }
  };

  const deleteIdentityGoal = async (goalId) => {
    const linkedHabits = habits.filter(h => h.identityGoalId === goalId);
    
    if (linkedHabits.length > 0) {
      toast.error('Cannot delete identity goal with linked habits. Remove habits first.');
      return;
    }

    if (!confirm('Are you sure you want to delete this identity goal?')) {
      return;
    }

    try {
      await identityGoalService.delete(goalId);
      setIdentityGoals(identityGoals.filter(g => g.id !== goalId));
      toast.success('Identity goal deleted');
    } catch (err) {
      toast.error('Failed to delete identity goal');
    }
  };

  const getLinkedHabits = (goalId) => {
    return habits.filter(habit => habit.identityGoalId === goalId);
  };

  const useExample = (example) => {
    setNewGoal(example);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card">
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-2/3"></div>
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
            onClick={loadIdentityData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
            Identity Goals
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Define who you want to become, then build habits that align with that identity
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Identity Goal</span>
        </motion.button>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-card p-6 mb-6"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-primary mb-2">Identity-Based Habits</h3>
            <p className="text-surface-700 dark:text-surface-300">
              Instead of focusing on what you want to achieve, focus on who you want to become. 
              Every action you take is a vote for the type of person you wish to be.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Identity Goals */}
      {identityGoals.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="User" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Define your identity
          </h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Start by creating identity goals that represent who you want to become.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
          >
            Create Your First Identity Goal
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {identityGoals.map((goal, index) => {
            const linkedHabits = getLinkedHabits(goal.id);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-surface-800 rounded-card p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
                      {goal.statement}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Target" className="w-4 h-4" />
                        <span>{linkedHabits.length} linked habits</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>Created {new Date(goal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteIdentityGoal(goal.id)}
                    className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                    title="Delete identity goal"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
                
                {linkedHabits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                      Supporting Habits:
                    </h4>
                    <div className="space-y-2">
                      {linkedHabits.map(habit => (
                        <div
                          key={habit.id}
                          className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            <span className="text-surface-900 dark:text-surface-50">
                              {habit.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Flame" className="w-4 h-4 text-orange-500" />
                            <span>{habit.currentStreak} day streak</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {linkedHabits.length === 0 && (
                  <div className="text-center py-4 text-surface-500 dark:text-surface-400">
                    <p className="text-sm">
                      No habits linked yet. Create habits that support this identity.
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Identity Goal Modal */}
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
              <div className="bg-white dark:bg-surface-800 rounded-card shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
                  Create Identity Goal
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Identity Statement
                    </label>
                    <textarea
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="I am a person who..."
                      className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg resize-none h-20 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={150}
                    />
                    <div className="text-xs text-surface-500 mt-1">
                      {newGoal.length}/150 characters
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                      Examples to get you started:
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {identityExamples.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => useExample(example)}
                          className="text-left p-3 text-sm bg-surface-50 dark:bg-surface-700 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors text-surface-900 dark:text-surface-50"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
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
                    onClick={createIdentityGoal}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Create Goal
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

export default Identity;