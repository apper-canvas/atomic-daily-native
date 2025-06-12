import { delay } from '../index.js';
import progressData from '../mockData/userProgress.json';

class UserProgressService {
  constructor() {
    this.data = { ...progressData };
  }

  async getProgress() {
    await delay(150);
    return { ...this.data };
  }

  async addXP(amount) {
    await delay(100);
    this.data.totalXP += amount;
    
    // Level up calculation (100 XP per level)
    const newLevel = Math.floor(this.data.totalXP / 100) + 1;
    const leveledUp = newLevel > this.data.level;
    this.data.level = newLevel;
    
    return { ...this.data, leveledUp };
  }

  async addBadge(badgeId) {
    await delay(100);
    if (!this.data.badges.includes(badgeId)) {
      this.data.badges.push(badgeId);
    }
    return { ...this.data };
  }

  async updateWeeklyStreak(streak) {
    await delay(100);
    this.data.weeklyStreak = streak;
    return { ...this.data };
  }

  async resetProgress() {
    await delay(200);
    this.data = {
      totalXP: 0,
      level: 1,
      badges: [],
      weeklyStreak: 0
    };
    return { ...this.data };
  }

  async calculateLevel(totalXP) {
    return Math.floor(totalXP / 100) + 1;
  }

  async getXPToNextLevel(totalXP) {
    const currentLevel = Math.floor(totalXP / 100) + 1;
    const xpForNextLevel = currentLevel * 100;
    return xpForNextLevel - totalXP;
  }
}

export default new UserProgressService();