"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Session, TimerType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (session: Session) => void;
  initialSession?: Session | null;
  triggerButton: React.ReactNode;
}

export function SessionForm({
  isOpen,
  onOpenChange,
  onSubmit,
  initialSession,
  triggerButton,
}: SessionFormProps) {
  const [selectedSession, setSelectedSession] = useState<{
    session: Session;
    startTimeInput: string;
    endTimeInput: string;
  }>(
    initialSession
      ? {
          session: initialSession,
          startTimeInput: `${initialSession.startTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${initialSession.startTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          endTimeInput: `${initialSession.endTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${initialSession.endTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        }
      : {
          session: {
            id: Math.random().toString(36).substr(2, 9),
            type: "gwen",
            startTime: new Date(),
            endTime: new Date(),
            duration: 0,
          },
          startTimeInput: `${new Date()
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date()
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          endTimeInput: `${new Date()
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date()
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(selectedSession.session.startTime);
    const endDate = new Date(selectedSession.session.endTime);
    const [startHours, startMinutes] = selectedSession.startTimeInput
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = selectedSession.endTimeInput
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
      newStartDate.setHours(startHours, startMinutes, 0, 0);

      if (
        !isNaN(endHours) &&
        !isNaN(endMinutes) &&
        endHours >= 0 &&
        endHours < 24 &&
        endMinutes >= 0 &&
        endMinutes < 60
      ) {
        const newEndDate = new Date(endDate);
        newEndDate.setHours(endHours, endMinutes, 0, 0);

        if (newEndDate > newStartDate) {
          const newDuration = Math.floor(
            (newEndDate.getTime() - newStartDate.getTime()) / 1000
          );
          const updatedSession = {
            ...selectedSession.session,
            startTime: newStartDate,
            endTime: newEndDate,
            duration: newDuration,
          };
          onSubmit(updatedSession);
          onOpenChange(false);
        } else {
          alert("End time must be after start time");
        }
      } else {
        alert("Invalid end time format");
      }
    } else {
      alert("Invalid start time format");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {initialSession ? "Edit Session" : "Add New Session"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={selectedSession.session.type}
                onValueChange={(value: TimerType) =>
                  setSelectedSession({
                    ...selectedSession,
                    session: {
                      ...selectedSession.session,
                      type: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gwen">Gwen</SelectItem>
                  <SelectItem value="smartback">Smartback</SelectItem>
                  <SelectItem value="jb">JB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <div className="space-y-2">
                <label htmlFor="startTime" className="text-sm font-medium">
                  Start Time
                </label>
                <div className="flex flex-col gap-2">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedSession.session.startTime)}
                    onSelect={(date) => {
                      if (date) {
                        const newDate = new Date(date);
                        const [hours, minutes] = selectedSession.startTimeInput
                          .split(":")
                          .map(Number);
                        newDate.setHours(hours, minutes, 0, 0);
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
                <label htmlFor="endTime" className="text-sm font-medium">
                  End Time
                </label>
                <div className="flex flex-col gap-2">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedSession.session.endTime)}
                    onSelect={(date) => {
                      if (date) {
                        const newDate = new Date(date);
                        const [hours, minutes] = selectedSession.endTimeInput
                          .split(":")
                          .map(Number);
                        newDate.setHours(hours, minutes, 59, 999);
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
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {initialSession ? "Save Changes" : "Add Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
