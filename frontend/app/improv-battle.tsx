'use client';

import { useState } from 'react';
import { Button } from '@/components/livekit/button';

type GamePhase = 'welcome' | 'intro' | 'scenario' | 'awaiting_response' | 'reaction' | 'done';

interface Round {
  scenario: string;
  response: string;
  reaction: string;
}

interface ImprovBattleProps {
  onBack?: () => void;
}

export function ImprovBattle({ onBack }: ImprovBattleProps) {
  const [phase, setPhase] = useState<GamePhase>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [introMessage, setIntroMessage] = useState('');
  const [currentScenario, setCurrentScenario] = useState('');
  const [playerResponse, setPlayerResponse] = useState('');
  const [hostReaction, setHostReaction] = useState('');
  const [finalSummary, setFinalSummary] = useState('');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:8000';

  const startGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/game/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName, max_rounds: 3 }),
      });

      if (!response.ok) throw new Error('Failed to start game');

      const data = await response.json();
      setGameId(data.game_id);
      setIntroMessage(data.intro_message);
      setPhase('intro');
    } catch (err) {
      setError('Failed to connect to game server. Make sure the backend is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRound = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/game/${gameId}/round/start`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to start round');

      const data = await response.json();
      setCurrentScenario(data.scenario);
      setPhase('awaiting_response');
      setPlayerResponse('');
    } catch (err) {
      setError('Failed to start round');
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!playerResponse.trim()) {
      setError('Please enter a response!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/game/${gameId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: playerResponse }),
      });

      if (!response.ok) throw new Error('Failed to submit response');

      const data = await response.json();
      setHostReaction(data.host_reaction);

      // Store the round
      setRounds((prev) => [
        ...prev,
        {
          scenario: currentScenario,
          response: playerResponse,
          reaction: data.host_reaction,
        },
      ]);

      if (data.is_game_over) {
        setFinalSummary(data.final_summary || '');
        setPhase('done');
      } else {
        setPhase('reaction');
      }
    } catch (err) {
      setError('Failed to submit response');
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setPhase('welcome');
    setPlayerName('');
    setGameId('');
    setIntroMessage('');
    setCurrentScenario('');
    setPlayerResponse('');
    setHostReaction('');
    setFinalSummary('');
    setRounds([]);
    setError('');
  };

  return (
    <div className="min-h-screen overflow-y-auto p-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Back button */}
        {onBack && phase === 'welcome' && (
          <div className="flex justify-start">
            <Button variant="secondary" onClick={onBack} className="mb-4">
              ← Back to Welcome
            </Button>
          </div>
        )}

        {/* Welcome Phase */}
        {phase === 'welcome' && (
          <div className="space-y-6 text-center">
            <div>
              <h1 className="mb-2 text-4xl font-bold">🎭 Improv Battle</h1>
              <p className="text-muted-foreground">
                Test your improvisation skills in this text-based comedy challenge!
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
                className="bg-background text-foreground w-full rounded-lg border px-4 py-3"
                disabled={isLoading}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={startGame}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Starting...' : 'Start Improv Battle'}
              </Button>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        )}

        {/* Intro Phase */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <p className="whitespace-pre-line">{introMessage}</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={startRound}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Loading...' : "Let's Go!"}
            </Button>
          </div>
        )}

        {/* Awaiting Response Phase */}
        {phase === 'awaiting_response' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <p className="mb-2 font-semibold">Your Scenario:</p>
              <p className="whitespace-pre-line">{currentScenario}</p>
            </div>

            <div className="space-y-4">
              <textarea
                placeholder="Type your improvised response here..."
                value={playerResponse}
                onChange={(e) => setPlayerResponse(e.target.value)}
                className="bg-background text-foreground min-h-32 w-full rounded-lg border px-4 py-3"
                disabled={isLoading}
              />

              <Button
                variant="primary"
                size="lg"
                onClick={submitResponse}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Submitting...' : 'Submit Response'}
              </Button>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        )}

        {/* Reaction Phase */}
        {phase === 'reaction' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <p className="mb-2 font-semibold">Host Reaction:</p>
              <p>{hostReaction}</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={startRound}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Next Round'}
            </Button>
          </div>
        )}

        {/* Done Phase */}
        {phase === 'done' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <p className="whitespace-pre-line">{finalSummary}</p>
            </div>

            <Button variant="primary" size="lg" onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </div>
        )}

        {/* Round History */}
        {rounds.length > 0 && phase !== 'done' && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Previous Rounds:</h3>
            {rounds.map((round, idx) => (
              <div key={idx} className="bg-card rounded-lg border p-4 text-sm">
                <p className="font-semibold">Round {idx + 1}</p>
                <p className="text-muted-foreground mt-1">{round.scenario}</p>
                <p className="mt-2 italic">"{round.response.substring(0, 100)}..."</p>
                <p className="mt-2 text-green-600">{round.reaction}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
