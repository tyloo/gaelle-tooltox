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
import { TimerPDF } from "@/components/timer-pdf";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-4">
        <CardTitle className="text-2xl font-bold">Timer</CardTitle>
        <Select
          value={timerType}
          onValueChange={(value: TimerType) => setTimerType(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue
              placeholder="Select timer type"
              className={cn("font-mono", {
                "text-emerald-600": timerType === "admin",
                "text-blue-600": timerType === "compta",
                "text-purple-600": timerType === "factures",
              })}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="admin"
              className="text-emerald-600 hover:text-emerald-600"
            >
              Admin
            </SelectItem>
            <SelectItem
              value="compta"
              className="text-blue-600 hover:text-blue-600"
            >
              Compta
            </SelectItem>
            <SelectItem
              value="factures"
              className="text-purple-600 hover:text-purple-600"
            >
              Factures
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mb-6 text-center">
          <div className="text-4xl font-mono mb-4">{formatTime(time)}</div>
          <div className="flex gap-2 justify-center">
            <Button
              variant={isRunning ? "secondary" : "default"}
              onClick={handleStart}
              disabled={isRunning}
              size="sm"
            >
              Start
            </Button>
            <Button
              variant={isRunning ? "default" : "secondary"}
              onClick={handleStop}
              disabled={!isRunning}
              size="sm"
            >
              Stop
            </Button>
            <Button variant="destructive" onClick={handleReset} size="sm">
              Reset
            </Button>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Session History</h3>
              <TimerPDF
                groupedSessions={groupedSessions}
                formatTime={formatTime}
              />
            </div>
            <div className="space-y-4">
              {Object.entries(groupedSessions).map(([type, group]) => (
                <Card key={type} className="rounded-md shadow-sm">
                  <CardContent className="pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4
                        className={cn("font-semibold capitalize", {
                          "text-emerald-600": type === "admin",
                          "text-blue-600": type === "compta",
                          "text-purple-600": type === "factures",
                        })}
                      >
                        {type}
                      </h4>
                      <p className="text-sm font-medium">
                        Total: {formatTime(group.totalDuration)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {group.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between rounded border border-muted bg-muted/10 p-2 text-sm"
                        >
                          <div className="space-y-1">
                            <p className="text-muted-foreground">
                              {session.startTime.toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}{" "}
                              {session.startTime.toLocaleTimeString("fr-FR")} -{" "}
                              {session.endTime.toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}{" "}
                              {session.endTime.toLocaleTimeString("fr-FR")}
                            </p>
                            <p>{formatTime(session.duration)}</p>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
