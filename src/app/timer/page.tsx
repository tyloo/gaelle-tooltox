"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TimerHeader } from "@/components/timer/timer-header";
import { TimerControls } from "@/components/timer/timer-controls";
import { SessionHistory } from "@/components/timer/session-history";
import { Session, TimerType } from "@/lib/types";

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [timerType, setTimerType] = useState<TimerType>("gwen");
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

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} heure${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} seconde${seconds > 1 ? "s" : ""}`);
    }

    return parts.join(" et ");
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
      setTime(0);
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
    <Card className="border-none shadow-none">
      <TimerHeader timerType={timerType} onTimerTypeChange={setTimerType} />
      <TimerControls
        time={time}
        isRunning={isRunning}
        formatTime={formatTime}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />
      <SessionHistory
        sessions={sessions}
        groupedSessions={groupedSessions}
        formatTime={formatTime}
        onRemoveSession={handleRemoveSession}
      />
    </Card>
  );
}
