import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ViewModeToggle from '@/components/molecules/ViewModeToggle';
import HabitListDisplay from '@/components/organisms/HabitListDisplay';
import AddHabitModal from '@/components/organisms/AddHabitModal';

import { habitService, identityGoalService } from '@/services/index.js'; // habitCompletionService not directly needed for display logic here

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [identityGoals, setIdentityGoals] = useState([]);
  const [completions, setCompletions] = useState([]); // Needed for heatmap data in HabitDisplayCard
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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
        // Only fetch completions if needed for the heatmap, otherwise omit or fetch less data
        // For now, let's keep it to ensure heatmap works as before
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
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Something went wrong
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400 mb-4">{error}</Text>
          <Button
            onClick={loadHabitsData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        &lt;div&gt;
          <Text as="h1" className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
            Your Habits
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400">
            Build consistency and track your progress
          </Text>
        &lt;/div&gt;
        
        <div className="flex items-center space-x-3">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <Text as="span">Add Habit</Text>
          </Button>
        </div>
      </div>

      <HabitListDisplay
        habits={habits}
        identityGoals={identityGoals}
        completions={completions}
        onDeleteHabit={deleteHabit}
        onAddHabitClick={() => setShowAddModal(true)}
      />

      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        onCreateHabit={createHabit}
        identityGoals={identityGoals}
      />
    </div>
  );
};

export default HabitsPage;