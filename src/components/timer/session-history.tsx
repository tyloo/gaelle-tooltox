"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TimerPDF } from "@/components/timer-pdf";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type TimerType = "admin" | "compta" | "factures";

type Session = {
  id: string;
  type: TimerType;
  startTime: Date;
  endTime: Date;
  duration: number;
};

interface SessionHistoryProps {
  sessions: Session[];
  groupedSessions: Record<
    TimerType,
    { sessions: Session[]; totalDuration: number }
  >;
  formatTime: (timeInSeconds: number) => string;
  onRemoveSession: (sessionId: string) => void;
}

export function SessionHistory({
  sessions,
  groupedSessions,
  formatTime,
  onRemoveSession,
}: SessionHistoryProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Session History</h3>
        <TimerPDF groupedSessions={groupedSessions} formatTime={formatTime} />
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
                      onClick={() => onRemoveSession(session.id)}
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
  );
}
