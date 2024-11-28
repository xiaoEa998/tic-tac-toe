import { Square } from './Square';

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  latestMove: number | undefined;
}

export function Board({ squares, onClick, winningLine, latestMove }: BoardProps) {
  const renderSquare = (i: number) => {
    return (
      <Square 
        key={i}
        value={squares[i]} 
        onClick={() => onClick(i)}
        isWinning={winningLine?.includes(i)}
        isLatest={latestMove === i}
      />
    );
  };

  return (
    <div className="board">
      {[0, 1, 2].map(row => (
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
} 