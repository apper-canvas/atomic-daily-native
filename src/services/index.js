export { default as identityGoalService } from './api/identityGoalService.js';
export { default as habitService } from './api/habitService.js';
export { default as habitCompletionService } from './api/habitCompletionService.js';
export { default as userProgressService } from './api/userProgressService.js';

// Utility function for service delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));