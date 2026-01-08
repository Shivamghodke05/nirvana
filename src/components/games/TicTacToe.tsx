import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const renderSquare = (i: number) => (
    <button 
      className="w-20 h-20 bg-muted text-3xl font-bold flex items-center justify-center rounded-md transition-colors hover:bg-muted/80"
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every(Boolean)) {
      return "It's a draw!";
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardContent className="pt-6 flex flex-col items-center gap-4">
        <div className="text-lg font-semibold">{getStatus()}</div>
        <div className="grid grid-cols-3 gap-2">
          {Array(9).fill(null).map((_, i) => renderSquare(i))}
        </div>
        <Button onClick={handleRestart}>Restart Game</Button>
      </CardContent>
    </Card>
  );
};

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
