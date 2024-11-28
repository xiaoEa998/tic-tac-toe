export const ai = {
  // 获取最佳移动位置
  getBestMove(squares: (string | null)[]): number {
    // 首先检查是否有机会获胜
    const winMove = this.findWinningMove(squares, 'O');
    if (winMove !== -1) return winMove;

    // 其次检查是否需要阻止玩家获胜
    const blockMove = this.findWinningMove(squares, 'X');
    if (blockMove !== -1) return blockMove;

    // 如果中心位置空闲，优先选择中心
    if (squares[4] === null) return 4;

    // 选择角落
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => squares[i] === null);
    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // 选择边
    const edges = [1, 3, 5, 7];
    const emptyEdges = edges.filter(i => squares[i] === null);
    if (emptyEdges.length > 0) {
      return emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
    }

    // 随机选择一个空位置
    const emptySquares = squares
      .map((square, index) => square === null ? index : -1)
      .filter(index => index !== -1);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  },

  // 查找获胜移动
  findWinningMove(squares: (string | null)[], player: string): number {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
      [0, 4, 8], [2, 4, 6]             // 斜
    ];

    for (const [a, b, c] of lines) {
      const squares2 = squares.slice();
      if (squares2[a] === player && squares2[b] === player && squares2[c] === null) return c;
      if (squares2[a] === player && squares2[c] === player && squares2[b] === null) return b;
      if (squares2[b] === player && squares2[c] === player && squares2[a] === null) return a;
    }
    return -1;
  }
}; 