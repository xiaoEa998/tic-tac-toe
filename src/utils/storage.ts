import type { GameState } from '../types/game';

const STORAGE_KEY = 'tic-tac-toe-game';

export const storage = {
  saveGame: (gameState: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('保存游戏状态失败:', e);
    }
  },

  loadGame: (): GameState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('加载游戏状态失败:', e);
      return null;
    }
  },

  clearGame: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('清除游戏状态失败:', e);
    }
  }
};  