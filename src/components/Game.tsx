import { useState, useEffect } from 'react';
import { Board } from './Board';
import { calculateWinner } from '../utils/gameLogic';
import { playSound } from '../utils/sound';
import { storage } from '../utils/storage';
import type { GameState } from '../types/game';
import { ai } from '../utils/ai';

export function Game() {
  const [isAIMode, setIsAIMode] = useState(true);
  const [gameState, setGameState] = useState<GameState>(() => {
    // 尝试从本地存储加载游戏状态
    return storage.loadGame() || {
      history: [{ squares: Array(9).fill(null) }],
      currentStep: 0,
      xIsNext: true,
    };
  });

  const current = gameState.history[gameState.currentStep];
  const winner = calculateWinner(current.squares);

  // 保存游戏状态到本地存储
  useEffect(() => {
    storage.saveGame(gameState);
  }, [gameState]);

  const handleClick = (i: number) => {
    const history = gameState.history.slice(0, gameState.currentStep + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // 如果不是玩家的回合或格子已被占用，直接返回
    if (!gameState.xIsNext || winner || squares[i]) return;

    // 玩家下棋
    squares[i] = 'X';
    
    const newGameState = {
      history: [...history, { squares, position: i }],
      currentStep: history.length,
      xIsNext: false, // 切换到 AI 回合
    };

    setGameState(newGameState);
    playSound.move();

    // 检查是否获胜或平局
    const newWinner = calculateWinner(squares);
    if (newWinner === 'draw') {
      playSound.draw();
    } else if (newWinner) {
      playSound.win();
    } else if (isAIMode) {
      // AI 立即思考并移动
      setTimeout(() => {
        const aiMove = ai.getBestMove(squares);
        if (aiMove !== -1) {
          const aiSquares = squares.slice();
          aiSquares[aiMove] = 'O';
          
          const aiGameState = {
            history: [...history, { squares: squares }, { squares: aiSquares, position: aiMove }],
            currentStep: history.length + 1,
            xIsNext: true, // 切换回玩家回合
          };
          
          setGameState(aiGameState);
          playSound.move();

          // 检查 AI 移动后是否获胜或平局
          const aiWinner = calculateWinner(aiSquares);
          if (aiWinner === 'draw') {
            playSound.draw();
          } else if (aiWinner) {
            playSound.win();
          }
        }
      }, 500); // 500ms 的延迟使移动看起来更自然
    }
  };

  const resetGame = () => {
    const newGameState = {
      history: [{ squares: Array(9).fill(null) }],
      currentStep: 0,
      xIsNext: true,
    };
    setGameState(newGameState);
    storage.clearGame();
  };

  const jumpTo = (step: number) => {
    setGameState(prev => ({
      ...prev,
      currentStep: step,
      xIsNext: step % 2 === 0,
    }));
  };

  // 获取获胜线条的位置
  const getWinningLine = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
      [0, 4, 8], [2, 4, 6]             // 斜
    ];

    for (const [a, b, c] of lines) {
      if (current.squares[a] && 
          current.squares[a] === current.squares[b] && 
          current.squares[a] === current.squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  };

  const winningLine = getWinningLine();

  const getStatus = () => {
    if (winner === 'draw') {
      return '游戏结束：平局！';
    } else if (winner) {
      return `游戏结束：${winner} 获胜！`;
    } else {
      return `下一步：${gameState.xIsNext ? 'X' : 'O'}`;
    }
  };

  // 生成历史记录列表
  const moves = gameState.history.map((move, step) => {
    const position = move.position;
    const row = position !== undefined ? Math.floor(position / 3) + 1 : null;
    const col = position !== undefined ? (position % 3) + 1 : null;
    
    const desc = step === 0 
      ? '回到游戏开始'
      : `回到第 ${step} 步 ${step % 2 === 0 ? 'O' : 'X'} (${row},${col})`;
    
    return (
      <li key={step} className="history-item">
        <button 
          className={`history-button ${step === gameState.currentStep ? 'current' : ''}`}
          onClick={() => jumpTo(step)}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares} 
          onClick={handleClick}
          winningLine={winningLine}
          latestMove={gameState.history[gameState.currentStep].position}
        />
      </div>
      <div className="game-info">
        <div className={`status ${winner ? 'winner' : ''}`}>
          {getStatus()}
        </div>
        <div className="game-controls">
          <button className="reset-button" onClick={resetGame}>
            重新开始
          </button>
          <button 
            className={`mode-button ${isAIMode ? 'active' : ''}`}
            onClick={() => setIsAIMode(!isAIMode)}
          >
            {isAIMode ? '人机对战' : '双人对战'}
          </button>
        </div>
        <div className="game-history">
          <h3>历史记录</h3>
          <ol className="history-list">
            {moves}
          </ol>
        </div>
      </div>
    </div>
  );
} 