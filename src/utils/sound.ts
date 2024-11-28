export const playSound = {
  move: () => {
    const audio = new Audio('/sounds/move.mp3');
    audio.play().catch(() => {});
  },
  win: () => {
    const audio = new Audio('/sounds/win.mp3');
    audio.play().catch(() => {});
  },
  draw: () => {
    const audio = new Audio('/sounds/draw.mp3');
    audio.play().catch(() => {});
  }
}; 