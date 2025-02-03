"use client";

import { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Session History</h2>
            <PDFDownloadLink
              document={
                <TimerPDF
                  groupedSessions={groupedSessions}
                  formatTime={formatTime}
                />
              }
              fileName="timer-sessions.pdf"
            >
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </PDFDownloadLink>
          </div>
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
                          {session.startTime.toLocaleTimeString("fr-FR")} -{" "}
                          {session.endTime.toLocaleTimeString("fr-FR")}
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

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  pricePerHour: {
    fontSize: 14,
    color: "#666666",
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

const roundToQuarterHour = (timeInSeconds: number) => {
  const minutes = timeInSeconds / 60;
  const roundedMinutes = Math.round(minutes / 15) * 15;
  return roundedMinutes * 60;
};

const formatHoursAndQuarters = (timeInSeconds: number) => {
  const totalMinutes = timeInSeconds / 60;
  const roundedMinutes = Math.round(totalMinutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const quarters = (roundedMinutes % 60) / 15;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (quarters > 0) {
    parts.push(`${quarters * 15}min`);
  }
  return parts.join(" ");
};

const getPricePerHour = (type: TimerType) => {
  switch (type) {
    case "admin":
      return 25;
    case "compta":
      return 20;
    case "factures":
      return 22;
    default:
      return 0;
  }
};

const TimerPDF = ({
  groupedSessions,
  formatTime,
}: {
  groupedSessions: Record<
    TimerType,
    { sessions: Session[]; totalDuration: number }
  >;
  formatTime: (timeInSeconds: number) => string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Timer Sessions Report</Text>
      {Object.entries(groupedSessions).map(([type, group]) => {
        const roundedDuration = roundToQuarterHour(group.totalDuration);
        const pricePerHour = getPricePerHour(type as TimerType);
        const hours = roundedDuration / 3600;
        const totalPrice = hours * pricePerHour;

        return (
          <View key={type} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{type}</Text>
              <Text style={styles.pricePerHour}>{pricePerHour}€/h</Text>
            </View>
            <View style={styles.sessionItem}>
              <Text style={styles.text}>
                Duration: {formatHoursAndQuarters(roundedDuration)}
              </Text>
              <Text style={styles.total}>Total: {totalPrice.toFixed(2)}€</Text>
            </View>
          </View>
        );
      })}
    </Page>
  </Document>
);
