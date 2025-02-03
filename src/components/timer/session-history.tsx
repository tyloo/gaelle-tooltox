"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TimerPDF } from "@/components/timer-pdf";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { SessionHistoryProps } from "@/lib/types";
import { useState } from "react";
import { Session } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SessionHistory({
  sessions,
  groupedSessions,
  formatTime,
  onRemoveSession,
}: SessionHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    session: Session;
    startTimeInput: string;
    endTimeInput: string;
  } | null>(null);

  if (sessions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historique des sessions</h3>
        <TimerPDF groupedSessions={groupedSessions} formatTime={formatTime} />
      </div>
      <div className="space-y-4">
        {Object.entries(groupedSessions).map(([type, group]) => (
          <Card key={type} className="rounded-md shadow-sm">
            <CardContent className="pt-4">
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
                    className="grid grid-cols-[1fr,auto] gap-8"
                  >
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
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
                      </p>
                      <p>{formatTime(session.duration)}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const startDate = new Date(session.startTime);
                              const endDate = new Date(session.endTime);
                              const startTimeInput = `${startDate
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${startDate
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`;
                              const endTimeInput = `${endDate
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${endDate
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`;
                              setSelectedSession({
                                session,
                                startTimeInput,
                                endTimeInput,
                              });
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
                        </DialogTrigger>
                        <DialogContent className="max-w-[800px]">
                          <DialogHeader>
                            <DialogTitle>Edit Session Time</DialogTitle>
                          </DialogHeader>
                          {selectedSession && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const startDate = new Date(
                                  selectedSession.session.startTime
                                );
                                const endDate = new Date(
                                  selectedSession.session.endTime
                                );
                                const [startHours, startMinutes] =
                                  selectedSession.startTimeInput
                                    .split(":")
                                    .map(Number);
                                const [endHours, endMinutes] =
                                  selectedSession.endTimeInput
                                    .split(":")
                                    .map(Number);

                                if (
                                  !isNaN(startHours) &&
                                  !isNaN(startMinutes) &&
                                  startHours >= 0 &&
                                  startHours < 24 &&
                                  startMinutes >= 0 &&
                                  startMinutes < 60
                                ) {
                                  const newStartDate = new Date(startDate);
                                  newStartDate.setHours(
                                    startHours,
                                    startMinutes,
                                    0,
                                    0
                                  );

                                  if (
                                    !isNaN(endHours) &&
                                    !isNaN(endMinutes) &&
                                    endHours >= 0 &&
                                    endHours < 24 &&
                                    endMinutes >= 0 &&
                                    endMinutes < 60
                                  ) {
                                    const newEndDate = new Date(endDate);
                                    newEndDate.setHours(
                                      endHours,
                                      endMinutes,
                                      0,
                                      0
                                    );

                                    if (newEndDate > newStartDate) {
                                      const newDuration = Math.floor(
                                        (newEndDate.getTime() -
                                          newStartDate.getTime()) /
                                          1000
                                      );
                                      const updatedSession = {
                                        ...selectedSession.session,
                                        startTime: newStartDate,
                                        endTime: newEndDate,
                                        duration: newDuration,
                                      };
                                      const updatedSessions = sessions.map(
                                        (s) =>
                                          s.id === selectedSession.session.id
                                            ? updatedSession
                                            : s
                                      );
                                      localStorage.setItem(
                                        "timerSessions",
                                        JSON.stringify(updatedSessions)
                                      );
                                      setIsDialogOpen(false);
                                      window.location.reload();
                                    } else {
                                      alert(
                                        "End time must be after start time"
                                      );
                                    }
                                  } else {
                                    alert("Invalid end time format");
                                  }
                                } else {
                                  alert("Invalid start time format");
                                }
                              }}
                              className="space-y-6"
                            >
                              <div className="flex gap-2">
                                <div className="space-y-2">
                                  <label
                                    htmlFor="startTime"
                                    className="text-sm font-medium"
                                  >
                                    Start Time
                                  </label>
                                  <div className="flex flex-col gap-2">
                                    <Calendar
                                      mode="single"
                                      selected={
                                        new Date(
                                          selectedSession.session.startTime
                                        )
                                      }
                                      onSelect={(date) => {
                                        if (date) {
                                          const newDate = new Date(date);
                                          const [hours, minutes] =
                                            selectedSession.startTimeInput
                                              .split(":")
                                              .map(Number);
                                          newDate.setHours(
                                            hours,
                                            minutes,
                                            0,
                                            0
                                          );
                                          setSelectedSession({
                                            ...selectedSession,
                                            session: {
                                              ...selectedSession.session,
                                              startTime: newDate,
                                            },
                                          });
                                        }
                                      }}
                                      className="rounded-md border"
                                    />
                                    <Input
                                      id="startTime"
                                      type="time"
                                      value={selectedSession.startTimeInput}
                                      onChange={(e) =>
                                        setSelectedSession({
                                          ...selectedSession,
                                          startTimeInput: e.target.value,
                                        })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label
                                    htmlFor="endTime"
                                    className="text-sm font-medium"
                                  >
                                    End Time
                                  </label>
                                  <div className="flex flex-col gap-2">
                                    <Calendar
                                      mode="single"
                                      selected={
                                        new Date(
                                          selectedSession.session.endTime
                                        )
                                      }
                                      onSelect={(date) => {
                                        if (date) {
                                          const newDate = new Date(date);
                                          const [hours, minutes] =
                                            selectedSession.endTimeInput
                                              .split(":")
                                              .map(Number);
                                          newDate.setHours(
                                            hours,
                                            minutes,
                                            59,
                                            999
                                          );
                                          setSelectedSession({
                                            ...selectedSession,
                                            session: {
                                              ...selectedSession.session,
                                              endTime: newDate,
                                            },
                                          });
                                        }
                                      }}
                                      className="rounded-md border"
                                    />
                                    <Input
                                      id="endTime"
                                      type="time"
                                      value={selectedSession.endTimeInput}
                                      onChange={(e) =>
                                        setSelectedSession({
                                          ...selectedSession,
                                          endTimeInput: e.target.value,
                                        })
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button type="submit">Save Changes</Button>
                              </div>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
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
