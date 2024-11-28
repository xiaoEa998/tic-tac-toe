interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinning?: boolean;
  isLatest?: boolean;
}

export function Square({ value, onClick, isWinning, isLatest }: SquareProps) {
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''} ${isLatest ? 'latest' : ''} ${value ? 'filled' : ''}`} 
      onClick={onClick}
    >
      {value}
    </button>
  );
} 