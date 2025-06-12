import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { habitService, habitCompletionService, identityGoalService, userProgressService } from '@/services/index.js';
import ProgressOverviewCard from '@/components/molecules/ProgressOverviewCard';
import DailyQuoteCard from '@/components/molecules/DailyQuoteCard';
import HabitListSection from '@/components/organisms/HabitListSection';
import TinyWinModal from '@/components/organisms/TinyWinModal';
import NoContentMessage from '@/components/molecules/NoContentMessage';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const motivationalQuotes = [
  "Every action you take is a vote for the type of person you wish to become.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Success is the product of daily habits—not once-in-a-lifetime transformations.",
  "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.",
  "Small changes often appear to make no difference until you cross a critical threshold."
];

const HomePage = () => {
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

  const closeTinyWinModal = () => {
    setSelectedHabit(null);
    setTinyWin('');
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

      closeTinyWinModal();
      toast.success('Tiny win saved!');
    } catch (err) {
      toast.error('Failed to save tiny win');
    }
  };

  const completedHabitsCount = habits.filter(habit => getHabitCompletion(habit.id).completed).length;
  const totalHabitsCount = habits.length;
  const progressPercentage = totalHabitsCount > 0 ? (completedHabitsCount / totalHabitsCount) * 100 : 0;

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
          <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
            Something went wrong
          </Text>
          <Text as="p" className="text-surface-600 dark:text-surface-400 mb-4">{error}</Text>
          <Button
            onClick={loadTodayData}
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
        iconName="Target"
        title="Ready to start building habits?"
        description="Create your first habit and begin your journey to becoming the person you want to be."
        buttonText="Create Your First Habit"
        onButtonClick={() => window.location.href = '/habits'}
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Text as="h1" className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
          {todayFormatted}
        </Text>
        <Text as="p" className="text-surface-600 dark:text-surface-400">
          Today is a new opportunity to become who you want to be
        </Text>
      </div>

      <ProgressOverviewCard
        completedHabits={completedHabitsCount}
        totalHabits={totalHabitsCount}
        percentage={progressPercentage}
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
      />

      <DailyQuoteCard
        quote={todayQuote}
        motionProps={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 } }}
      />

      <HabitListSection
        habits={habits}
        completions={completions}
        identityGoals={identityGoals}
        onToggleCompletion={toggleHabitCompletion}
        onOpenTinyWin={openTinyWinModal}
      />

      <TinyWinModal
        isOpen={!!selectedHabit}
        onClose={closeTinyWinModal}
        habitName={selectedHabit?.name || ''}
        tinyWin={tinyWin}
        setTinyWin={setTinyWin}
        onSaveTinyWin={saveTinyWin}
      />
    </div>
  );
};

export default HomePage;