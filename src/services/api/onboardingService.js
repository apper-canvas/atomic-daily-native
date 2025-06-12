// Onboarding service for managing user setup flow
const ONBOARDING_STORAGE_KEY = 'atomic-daily-onboarding-completed';
const ONBOARDING_PROGRESS_KEY = 'atomic-daily-onboarding-progress';

class OnboardingService {
  // Check if user has completed onboarding
  isOnboardingCompleted() {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  }

  // Mark onboarding as completed
  markOnboardingCompleted() {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
  }

  // Save onboarding progress
  saveProgress(step, data) {
    const progress = this.getProgress();
    progress[step] = data;
    localStorage.setItem(ONBOARDING_PROGRESS_KEY, JSON.stringify(progress));
  }

  // Get current onboarding progress
  getProgress() {
    const stored = localStorage.getItem(ONBOARDING_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // Clear onboarding progress (for testing/reset)
  resetOnboarding() {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
  }

  // Get starter habit recommendations
  getStarterHabits() {
    return [
      {
        name: 'Drink a glass of water',
        category: 'Health',
        description: 'Start your day with hydration'
      },
      {
        name: 'Read for 10 minutes',
        category: 'Learning',
        description: 'Expand your knowledge daily'
      },
      {
        name: 'Take a 5-minute walk',
        category: 'Fitness',
        description: 'Get your body moving'
      },
      {
        name: 'Practice gratitude',
        category: 'Mindfulness',
        description: 'Write down 3 things you\'re grateful for'
      },
      {
        name: 'Make your bed',
        category: 'Organization',
        description: 'Start with a small win'
      },
      {
        name: 'Meditate for 5 minutes',
        category: 'Mindfulness',
        description: 'Center yourself for the day'
      }
    ];
  }

  // Get identity goal examples
  getIdentityExamples() {
    return [
      'I am a person who prioritizes their health and wellness',
      'I am a person who continuously learns and grows',
      'I am a person who maintains strong relationships',
      'I am a person who stays organized and productive',
      'I am a person who practices mindfulness and gratitude',
      'I am a person who takes care of their physical fitness',
      'I am a person who reads and expands their knowledge',
      'I am a person who maintains a positive mindset'
    ];
  }
}

export const onboardingService = new OnboardingService();