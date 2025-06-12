import { delay } from '../index.js';
import habitsData from '../mockData/habits.json';

class HabitService {
  constructor() {
    this.data = [...habitsData];
  }

  async getAll() {
    await delay(250);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const habit = this.data.find(item => item.id === id);
    return habit ? { ...habit } : null;
  }

  async getByIdentityGoal(identityGoalId) {
    await delay(200);
    return this.data.filter(habit => habit.identityGoalId === identityGoalId).map(habit => ({ ...habit }));
  }

  async create(habitData) {
    await delay(350);
    const newHabit = {
      ...habitData,
      id: Date.now().toString(),
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    };
    this.data.push(newHabit);
    return { ...newHabit };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Habit not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Habit not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async updateStreak(id, currentStreak) {
    await delay(150);
    const habit = this.data.find(item => item.id === id);
    if (!habit) throw new Error('Habit not found');
    
    habit.currentStreak = currentStreak;
    if (currentStreak > habit.longestStreak) {
      habit.longestStreak = currentStreak;
    }
    return { ...habit };
  }
}

export default new HabitService();