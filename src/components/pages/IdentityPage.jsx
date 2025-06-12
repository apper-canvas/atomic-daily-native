import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import IdentityInfoCard from '@/components/molecules/IdentityInfoCard';
import IdentityGoalList from '@/components/organisms/IdentityGoalList';
import AddIdentityGoalModal from '@/components/organisms/AddIdentityGoalModal';

import { identityGoalService, habitService } from '@/services/index.js';

const IdentityPage = () => {
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
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Something went wrong
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400 mb-4">{error}</Text>
          <Button
            onClick={loadIdentityData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        &lt;div&gt;
          <Text as="h1" className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
            Identity Goals
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400">
            Define who you want to become, then build habits that align with that identity
          </Text>
        &lt;/div&gt;
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-card hover:shadow-card-hover transition-all"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <Text as="span">Add Identity Goal</Text>
        </Button>
      </div>

      <IdentityInfoCard motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }} className="mb-6" />

      <IdentityGoalList
        identityGoals={identityGoals}
        habits={habits}
        onDeleteGoal={deleteIdentityGoal}
        onAddGoalClick={() => setShowAddModal(true)}
      />

      <AddIdentityGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        onCreateGoal={createIdentityGoal}
        identityExamples={identityExamples}
        onUseExample={useExample}
      />
    </div>
  );
};

export default IdentityPage;