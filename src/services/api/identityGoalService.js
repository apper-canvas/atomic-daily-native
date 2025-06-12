import { delay } from '../index.js';
import identityGoalsData from '../mockData/identityGoals.json';

class IdentityGoalService {
  constructor() {
    this.data = [...identityGoalsData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const goal = this.data.find(item => item.id === id);
    return goal ? { ...goal } : null;
  }

  async create(goalData) {
    await delay(300);
    const newGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      linkedHabits: []
    };
    this.data.push(newGoal);
    return { ...newGoal };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Identity goal not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Identity goal not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async addLinkedHabit(goalId, habitId) {
    await delay(150);
    const goal = this.data.find(item => item.id === goalId);
    if (!goal) throw new Error('Identity goal not found');
    
    if (!goal.linkedHabits.includes(habitId)) {
      goal.linkedHabits.push(habitId);
    }
    return { ...goal };
  }

  async removeLinkedHabit(goalId, habitId) {
    await delay(150);
    const goal = this.data.find(item => item.id === goalId);
    if (!goal) throw new Error('Identity goal not found');
    
    goal.linkedHabits = goal.linkedHabits.filter(id => id !== habitId);
    return { ...goal };
  }
}

export default new IdentityGoalService();