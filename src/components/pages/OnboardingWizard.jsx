import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { onboardingService } from '@/services/api/onboardingService';
import { identityGoalService, habitService } from '@/services/index';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step data
  const [selectedIdentityGoals, setSelectedIdentityGoals] = useState([]);
  const [customIdentityGoal, setCustomIdentityGoal] = useState('');
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [reminderTime, setReminderTime] = useState('09:00');

  const totalSteps = 5;
  const identityExamples = onboardingService.getIdentityExamples();
  const starterHabits = onboardingService.getStarterHabits();

  useEffect(() => {
    // Load any existing progress
    const progress = onboardingService.getProgress();
    if (progress.identityGoals) setSelectedIdentityGoals(progress.identityGoals);
    if (progress.customIdentity) setCustomIdentityGoal(progress.customIdentity);
    if (progress.habits) setSelectedHabits(progress.habits);
    if (progress.reminderTime) setReminderTime(progress.reminderTime);
  }, []);

  const saveStepProgress = (stepData) => {
    onboardingService.saveProgress(`step${currentStep}`, stepData);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleIdentityGoal = (goal) => {
    const updated = selectedIdentityGoals.includes(goal)
      ? selectedIdentityGoals.filter(g => g !== goal)
      : [...selectedIdentityGoals, goal];
    setSelectedIdentityGoals(updated);
    saveStepProgress({ identityGoals: updated });
  };

  const toggleHabit = (habit) => {
    const updated = selectedHabits.some(h => h.name === habit.name)
      ? selectedHabits.filter(h => h.name !== habit.name)
      : [...selectedHabits, habit];
    setSelectedHabits(updated);
    saveStepProgress({ habits: updated });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create identity goals
      const identityGoals = [...selectedIdentityGoals];
      if (customIdentityGoal.trim()) {
        identityGoals.push(customIdentityGoal.trim());
      }

      const createdGoals = [];
      for (const goal of identityGoals) {
        const created = await identityGoalService.create({ statement: goal });
        createdGoals.push(created);
      }

      // Create habits linked to first identity goal
      const primaryGoalId = createdGoals.length > 0 ? createdGoals[0].id : null;
      for (const habit of selectedHabits) {
        await habitService.create({
          name: habit.name,
          identityGoalId: primaryGoalId,
          reminderTime: reminderTime,
          isActive: true
        });
      }

      // Mark onboarding as completed
      onboardingService.markOnboardingCompleted();
      
      toast.success('Welcome to Atomic Daily! Your journey begins now.');
      navigate('/today');
    } catch (error) {
      toast.error('Failed to complete setup. Please try again.');
      console.error('Onboarding completion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Zap" className="w-10 h-10 text-white" />
            </div>
            <div>
              <Text as="h2" className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-3">
                Welcome to Atomic Daily
              </Text>
              <Text className="text-surface-600 dark:text-surface-400 text-lg leading-relaxed">
                Transform your life through small, consistent actions. We'll help you build habits that align with who you want to become.
              </Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="p-4 text-center">
                <ApperIcon name="Target" className="w-8 h-8 text-primary mx-auto mb-2" />
                <Text className="font-medium text-surface-900 dark:text-surface-50">Define Your Identity</Text>
                <Text className="text-sm text-surface-600 dark:text-surface-400">Choose who you want to become</Text>
              </Card>
              <Card className="p-4 text-center">
                <ApperIcon name="Repeat" className="w-8 h-8 text-primary mx-auto mb-2" />
                <Text className="font-medium text-surface-900 dark:text-surface-50">Build Habits</Text>
                <Text className="text-sm text-surface-600 dark:text-surface-400">Start with simple daily actions</Text>
              </Card>
              <Card className="p-4 text-center">
                <ApperIcon name="TrendingUp" className="w-8 h-8 text-primary mx-auto mb-2" />
                <Text className="font-medium text-surface-900 dark:text-surface-50">Track Progress</Text>
                <Text className="text-sm text-surface-600 dark:text-surface-400">See your transformation over time</Text>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Text as="h2" className="text-xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
                Define Your Identity
              </Text>
              <Text className="text-surface-600 dark:text-surface-400">
                Select the identities that resonate with who you want to become
              </Text>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
              {identityExamples.map((goal, index) => (
                <Button
                  key={index}
                  onClick={() => toggleIdentityGoal(goal)}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedIdentityGoals.includes(goal)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 text-surface-900 dark:text-surface-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{goal}</span>
                    {selectedIdentityGoals.includes(goal) && (
                      <ApperIcon name="Check" className="w-5 h-5" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <FormField label="Or create your own identity statement" id="custom-identity">
              <Input
                type="textarea"
                value={customIdentityGoal}
                onChange={(e) => {
                  setCustomIdentityGoal(e.target.value);
                  saveStepProgress({ customIdentity: e.target.value });
                }}
                placeholder="I am a person who..."
                className="h-20"
              />
            </FormField>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Text as="h2" className="text-xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
                Choose Your Starter Habits
              </Text>
              <Text className="text-surface-600 dark:text-surface-400">
                Select 2-3 simple habits to begin your journey
              </Text>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {starterHabits.map((habit, index) => (
                <Button
                  key={index}
                  onClick={() => toggleHabit(habit)}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedHabits.some(h => h.name === habit.name)
                      ? 'border-primary bg-primary/10'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Text className="font-medium text-surface-900 dark:text-surface-50 mb-1">
                        {habit.name}
                      </Text>
                      <Text className="text-xs text-surface-500 dark:text-surface-400 mb-2">
                        {habit.category}
                      </Text>
                      <Text className="text-sm text-surface-600 dark:text-surface-300">
                        {habit.description}
                      </Text>
                    </div>
                    {selectedHabits.some(h => h.name === habit.name) && (
                      <ApperIcon name="Check" className="w-5 h-5 text-primary ml-2" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {selectedHabits.length > 3 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <Text className="text-sm text-amber-800 dark:text-amber-200">
                  💡 Starting with 2-3 habits is recommended for better success rates
                </Text>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Text as="h2" className="text-xl font-display font-bold text-surface-900 dark:text-surface-50 mb-2">
                Set Your Daily Reminder
              </Text>
              <Text className="text-surface-600 dark:text-surface-400">
                Choose a time when you'd like to be reminded about your habits
              </Text>
            </div>
            
            <div className="max-w-sm mx-auto">
              <FormField label="Reminder Time" id="reminder-time">
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => {
                    setReminderTime(e.target.value);
                    saveStepProgress({ reminderTime: e.target.value });
                  }}
                  className="text-center text-lg"
                />
              </FormField>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <Text className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Consistency is key
                  </Text>
                  <Text className="text-sm text-blue-700 dark:text-blue-200">
                    Choose a time when you can consistently check in with your habits. You can always adjust this later in settings.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <Text as="h2" className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50 mb-3">
                You're All Set!
              </Text>
              <Text className="text-surface-600 dark:text-surface-400 text-lg">
                Your journey to becoming your best self starts now
              </Text>
            </div>

            <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-6 space-y-4">
              <Text className="font-medium text-surface-900 dark:text-surface-50">Your Setup Summary:</Text>
              
              <div className="text-left space-y-3">
                <div>
                  <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">Identity Goals:</Text>
                  <Text className="text-sm text-surface-600 dark:text-surface-400">
                    {selectedIdentityGoals.length + (customIdentityGoal ? 1 : 0)} selected
                  </Text>
                </div>
                
                <div>
                  <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">Starter Habits:</Text>
                  <Text className="text-sm text-surface-600 dark:text-surface-400">
                    {selectedHabits.map(h => h.name).join(', ')}
                  </Text>
                </div>
                
                <div>
                  <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">Daily Reminder:</Text>
                  <Text className="text-sm text-surface-600 dark:text-surface-400">
                    {reminderTime}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return selectedIdentityGoals.length > 0 || customIdentityGoal.trim();
      case 3:
        return selectedHabits.length > 0;
      case 4:
        return reminderTime;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Step {currentStep} of {totalSteps}
            </Text>
            <Text className="text-sm text-surface-500 dark:text-surface-400">
              {Math.round((currentStep / totalSteps) * 100)}% complete
            </Text>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'text-surface-400 dark:text-surface-600 cursor-not-allowed'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
            }`}
          >
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-blue-600'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-600 cursor-not-allowed'
              }`}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading || !canProceed()}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
            >
              {loading && <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Setting up...' : 'Complete Setup'}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;