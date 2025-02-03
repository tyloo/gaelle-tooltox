"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type TimerType = "admin" | "compta" | "factures";

type Session = {
  id: string;
  type: TimerType;
  startTime: Date;
  endTime: Date;
  duration: number;
};

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

interface TimerPDFProps {
  groupedSessions: Record<
    TimerType,
    { sessions: Session[]; totalDuration: number }
  >;
  formatTime: (timeInSeconds: number) => string;
}

const TimerPDFContent = ({ groupedSessions, formatTime }: TimerPDFProps) => (
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
              <Text style={styles.pricePerHour}>{pricePerHour}€ / h</Text>
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

export const TimerPDF = ({ groupedSessions, formatTime }: TimerPDFProps) => (
  <PDFDownloadLink
    document={
      <TimerPDFContent
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
);
