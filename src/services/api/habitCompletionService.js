import { delay } from '../index.js';
import completionsData from '../mockData/habitCompletions.json';
import { format, parseISO, isToday, subDays } from 'date-fns';

class HabitCompletionService {
  constructor() {
    this.data = [...completionsData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getByHabitId(habitId) {
    await delay(150);
    return this.data.filter(completion => completion.habitId === habitId).map(completion => ({ ...completion }));
  }

  async getByDate(date) {
    await delay(150);
    const dateStr = format(new Date(date), 'yyyy-MM-dd');
    return this.data.filter(completion => completion.date === dateStr).map(completion => ({ ...completion }));
  }

  async getTodayCompletions() {
    await delay(100);
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.data.filter(completion => completion.date === today).map(completion => ({ ...completion }));
  }

  async create(completionData) {
    await delay(200);
    const newCompletion = {
      ...completionData,
      id: Date.now().toString(),
      date: format(new Date(completionData.date || new Date()), 'yyyy-MM-dd')
    };
    this.data.push(newCompletion);
    return { ...newCompletion };
  }

  async update(habitId, date, updates) {
    await delay(150);
    const dateStr = format(new Date(date), 'yyyy-MM-dd');
    const index = this.data.findIndex(completion => 
      completion.habitId === habitId && completion.date === dateStr
    );
    
    if (index === -1) {
      // Create new completion if it doesn't exist
      return this.create({ habitId, date: dateStr, ...updates });
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async getStreakData(habitId) {
    await delay(200);
    const completions = this.data
      .filter(completion => completion.habitId === habitId && completion.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (completions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let checkDate = new Date();

    // Calculate current streak
    for (let i = 0; i < completions.length; i++) {
      const completionDate = parseISO(completions[i].date);
      const expectedDate = subDays(checkDate, i);
      
      if (format(completionDate, 'yyyy-MM-dd') === format(expectedDate, 'yyyy-MM-dd')) {
        currentStreak++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        break;
      }
    }

    // Calculate longest streak by checking all completion sequences
    tempStreak = 0;
    for (let i = 0; i < completions.length; i++) {
      const currentDate = parseISO(completions[i].date);
      const nextDate = i < completions.length - 1 ? parseISO(completions[i + 1].date) : null;
      
      tempStreak++;
      
      if (!nextDate || Math.abs((currentDate - nextDate) / (1000 * 60 * 60 * 24)) > 1) {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 0;
      }
    }

    return { currentStreak, longestStreak };
  }

  async getHeatmapData(habitId, startDate, endDate) {
    await delay(250);
    const completions = this.data.filter(completion => {
      const date = parseISO(completion.date);
      return completion.habitId === habitId && 
             date >= startDate && 
             date <= endDate;
    });

    return completions.map(completion => ({
      ...completion,
      intensity: completion.completed ? 1 : 0
    }));
  }
}

export default new HabitCompletionService();