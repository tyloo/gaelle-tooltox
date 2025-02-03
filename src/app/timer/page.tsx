"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type TimerType = "admin" | "compta" | "factures";

type Session = {
  id: string;
  type: TimerType;
  startTime: Date;
  endTime: Date;
  duration: number;
};

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [timerType, setTimerType] = useState<TimerType>("admin");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem("timerSessions");
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map(
        (session: Session) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        })
      );
      setSessions(parsedSessions);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("timerSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
  };

  const handleStop = () => {
    setIsRunning(false);
    if (startTime) {
      const endTime = new Date();
      const newSession: Session = {
        id: Math.random().toString(36).substr(2, 9),
        type: timerType,
        startTime,
        endTime,
        duration: time,
      };
      setSessions((prev) => [newSession, ...prev]);
      setStartTime(null);
      setTime(0); // Reset the timer when stopping
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setStartTime(null);
  };

  const handleRemoveSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.type]) {
      acc[session.type] = {
        sessions: [],
        totalDuration: 0,
      };
    }
    acc[session.type].sessions.push(session);
    acc[session.type].totalDuration += session.duration;
    return acc;
  }, {} as Record<TimerType, { sessions: Session[]; totalDuration: number }>);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Timer</h1>
        <Select
          value={timerType}
          onValueChange={(value: TimerType) => setTimerType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="compta">Compta</SelectItem>
            <SelectItem value="factures">Factures</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-4xl font-mono">{formatTime(time)}</div>
      <div className="flex gap-4">
        <Button
          variant={isRunning ? "secondary" : "default"}
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </Button>
        <Button
          variant={isRunning ? "default" : "secondary"}
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </Button>
        <Button variant="destructive" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {sessions.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="mb-4 text-xl font-semibold">Session History</h2>
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([type, group]) => (
              <div key={type} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">{type}</h3>
                  <p className="text-sm font-medium">
                    Total: {formatTime(group.totalDuration)}
                  </p>
                </div>
                <div className="space-y-3">
                  {group.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded border border-muted bg-muted/10 p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {session.startTime.toLocaleTimeString()} -{" "}
                          {session.endTime.toLocaleTimeString()}
                        </p>
                        <p className="text-sm">
                          {formatTime(session.duration)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
