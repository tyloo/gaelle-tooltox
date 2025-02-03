"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TimerType = "admin" | "compta" | "factures";

interface TimerHeaderProps {
  timerType: TimerType;
  onTimerTypeChange: (value: TimerType) => void;
}

export function TimerHeader({
  timerType,
  onTimerTypeChange,
}: TimerHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-4">
      <CardTitle className="text-2xl font-bold">Timer</CardTitle>
      <Select value={timerType} onValueChange={onTimerTypeChange}>
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
  );
}
