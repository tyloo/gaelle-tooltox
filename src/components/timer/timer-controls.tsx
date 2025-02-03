"use client";

import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  time: number;
  isRunning: boolean;
  formatTime: (timeInSeconds: number) => string;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerControls({
  time,
  isRunning,
  formatTime,
  onStart,
  onStop,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="mb-6 text-center">
      <div className="text-4xl font-mono mb-4">{formatTime(time)}</div>
      <div className="flex gap-2 justify-center">
        <Button
          variant={isRunning ? "secondary" : "default"}
          onClick={onStart}
          disabled={isRunning}
          size="sm"
        >
          Start
        </Button>
        <Button
          variant={isRunning ? "default" : "secondary"}
          onClick={onStop}
          disabled={!isRunning}
          size="sm"
        >
          Stop
        </Button>
        <Button variant="destructive" onClick={onReset} size="sm">
          Reset
        </Button>
      </div>
    </div>
  );
}
