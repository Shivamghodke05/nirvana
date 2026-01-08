import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TicTacToe from '@/components/games/TicTacToe';
import ImagePuzzle from '@/components/games/ImagePuzzle';
import SnakeGame from '@/components/games/SnakeGame';
import MemoryFlipGame from '@/components/games/MemoryFlipGame';
import { Puzzle, Rabbit, Gamepad, Brain } from 'lucide-react';

type GameId = 'tictactoe' | 'imagepuzzle' | 'snake' | 'memoryflip';

const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const games = [
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: Gamepad, component: <TicTacToe /> },
    { id: 'imagepuzzle', name: 'Image Puzzle', icon: Puzzle, component: <ImagePuzzle /> },
    { id: 'snake', name: 'Snake Game', icon: Rabbit, component: <SnakeGame /> },
    { id: 'memoryflip', name: 'Memory Flip', icon: Brain, component: <MemoryFlipGame /> },
  ];

  const renderGameContent = () => {
    if (activeGame) {
      const game = games.find(g => g.id === activeGame);
      return (
        <div>
          <Button onClick={() => setActiveGame(null)} className="mb-4">
            &larr; Back to Games
          </Button>
          {game?.component}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map(game => (
          <Card 
            key={game.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveGame(game.id as GameId)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <game.icon className="h-8 w-8 text-primary" />
              <CardTitle>{game.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A fun and relaxing mini-game to take a break.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mindful Games</CardTitle>
      </CardHeader>
      <CardContent>
        {renderGameContent()}
      </CardContent>
    </Card>
  );
};

export default Games;
