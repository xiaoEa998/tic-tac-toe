export interface Move {
  squares: (string | null)[];
  position?: number;
}

export interface GameState {
  history: Move[];
  currentStep: number;
  xIsNext: boolean;
} 