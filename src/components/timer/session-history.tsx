"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TimerPDF } from "@/components/timer-pdf";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { SessionHistoryProps } from "@/lib/types";
import { useState } from "react";
import { Session } from "@/lib/types";
import { SessionForm } from "@/components/timer/session-form";

export function SessionHistory({
  sessions,
  groupedSessions,
  formatTime,
  onRemoveSession,
}: SessionHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historique des sessions</h3>
        <div className="flex items-center gap-2">
          <SessionForm
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={(session) => {
              const updatedSessions = [session, ...sessions];
              localStorage.setItem(
                "timerSessions",
                JSON.stringify(updatedSessions)
              );
              window.location.reload();
            }}
            triggerButton={
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            }
          />
          <TimerPDF groupedSessions={groupedSessions} formatTime={formatTime} />
        </div>
      </div>
      <div className="space-y-4">
        {Object.entries(groupedSessions).map(([type, group]) => (
          <Card key={type} className="rounded-md shadow-sm">
            <CardContent
              className={cn("pt-4 rounded-sm border shadow-sm", {
                "bg-emerald-50 border-emerald-600/30": type === "gwen",
                "bg-blue-50 border-blue-600/30": type === "smartback",
                "bg-purple-50 border-purple-600/30": type === "jb",
              })}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4
                  className={cn("font-semibold capitalize", {
                    "text-emerald-600": type === "gwen",
                    "text-blue-600": type === "smartback",
                    "text-purple-600": type === "jb",
                  })}
                >
                  Administratif {type}
                </h4>
                <p className="text-sm font-medium">
                  Total: {formatTime(group.totalDuration)}
                </p>
              </div>
              <div className="space-y-2">
                {group.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="grid grid-cols-[1fr,auto] gap-8 border py-2 px-4 text-md rounded-md"
                  >
                    <div className="flex items-center space-y-1">
                      {session.startTime.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {session.startTime.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {session.endTime.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {session.endTime.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="text-muted-foreground ml-1">
                        ({formatTime(session.duration)})
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <SessionForm
                        isOpen={
                          isDialogOpen && selectedSession?.id === session.id
                        }
                        onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) setSelectedSession(null);
                        }}
                        initialSession={selectedSession}
                        onSubmit={(updatedSession) => {
                          const updatedSessions = sessions.map((s) =>
                            s.id === updatedSession.id ? updatedSession : s
                          );
                          localStorage.setItem(
                            "timerSessions",
                            JSON.stringify(updatedSessions)
                          );
                          window.location.reload();
                        }}
                        triggerButton={
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSession(session);
                              setIsDialogOpen(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
