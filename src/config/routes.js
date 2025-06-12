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
  }
};

export const routeArray = Object.values(routes);