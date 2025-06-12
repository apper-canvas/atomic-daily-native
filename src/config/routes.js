import HomePage from '@/components/pages/HomePage.jsx';
import HabitsPage from '@/components/pages/HabitsPage.jsx';
import ProgressPage from '@/components/pages/ProgressPage.jsx';
import IdentityPage from '@/components/pages/IdentityPage.jsx';

export const routes = {
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: HomePage
  },
  habits: {
    id: 'habits',
    label: 'Habits',
    path: '/habits',
    icon: 'Target',
    component: HabitsPage
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: ProgressPage
  },
  identity: {
    id: 'identity',
    label: 'Identity',
    path: '/identity',
    icon: 'User',
    component: IdentityPage
  },
  onboarding: {
    id: 'onboarding',
    label: 'Onboarding',
    path: '/onboarding',
    icon: 'User',
    component: () => import('@/components/pages/OnboardingWizard.jsx')
  }
};

export const routeArray = Object.values(routes);