import Today from '../pages/Today.jsx';
import Habits from '../pages/Habits.jsx';
import Progress from '../pages/Progress.jsx';
import Identity from '../pages/Identity.jsx';

export const routes = {
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  habits: {
    id: 'habits',
    label: 'Habits',
    path: '/habits',
    icon: 'Target',
    component: Habits
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  identity: {
    id: 'identity',
    label: 'Identity',
    path: '/identity',
    icon: 'User',
    component: Identity
  }
};

export const routeArray = Object.values(routes);