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
import { Session, TimerType } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "bold",
  },
  companyDetails: {
    fontSize: 10,
    color: "#666666",
    marginTop: 4,
  },
  invoiceInfo: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#333333",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  invoiceDetails: {
    fontSize: 10,
    color: "#666666",
    marginTop: 4,
  },
  clientInfo: {
    marginTop: 0,
    marginBottom: 40,
  },
  clientTitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 25,
    borderBottom: "1 solid #CCCCCC",
    paddingBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#333333",
  },
  pricePerHour: {
    fontSize: 14,
    color: "#666666",
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8 0",
  },
  text: {
    fontSize: 12,
    color: "#444444",
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  summary: {
    marginTop: 30,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666666",
    marginRight: 20,
    width: 100,
    textAlign: "right",
  },
  summaryValue: {
    fontSize: 12,
    color: "#333333",
    width: 80,
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
    borderTop: "1 solid #CCCCCC",
    paddingTop: 20,
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
    case "gwen":
      return 22;
    case "smartback":
      return 25;
    case "jb":
      return 25;
    default:
      return 25;
  }
};

interface TimerPDFProps {
  groupedSessions: Record<
    TimerType,
    { sessions: Session[]; totalDuration: number }
  >;
  formatTime: (timeInSeconds: number) => string;
}

const TimerPDFContent = ({ groupedSessions }: TimerPDFProps) => {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(
    3,
    "0"
  )}`;
  const invoiceDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let subtotal = 0;
  const VAT_RATE = 0; // 20% VAT

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>COQUARD GAELLE</Text>
            <Text style={styles.companyDetails}>77630 ARBONNE-LA-FORÊT</Text>
            <Text style={styles.companyDetails}>FRANCE</Text>
            <Text style={styles.companyDetails}>
              contact.gcoquard@gmail.com
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.title}>Facture</Text>
            <Text style={styles.invoiceDetails}>N° {invoiceNumber}</Text>
            <Text style={styles.invoiceDetails}>Date: {invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientTitle}>Facturer à:</Text>
          <Text style={styles.clientName}>OPTIMIGROWTH</Text>
          <Text style={styles.companyDetails}>
            10 Rue DE L'ECOLE GRAND CERISEAUX
          </Text>
          <Text style={styles.companyDetails}>77460 SOUPPES-SUR-LOING</Text>
          <Text style={styles.companyDetails}>SIRET : 98405510300019</Text>
        </View>

        {Object.entries(groupedSessions)
          .filter(([type, group]) => {
            const roundedDuration = roundToQuarterHour(group.totalDuration);
            const pricePerHour = getPricePerHour(type as TimerType);
            const hours = roundedDuration / 3600;
            const totalPrice = hours * pricePerHour;
            if (totalPrice > 0) subtotal += totalPrice;
            return group.totalDuration > 0 && totalPrice > 0;
          })
          .map(([type, group]) => {
            const roundedDuration = roundToQuarterHour(group.totalDuration);
            const pricePerHour = getPricePerHour(type as TimerType);
            const hours = roundedDuration / 3600;
            const totalPrice = hours * pricePerHour;

            return (
              <View key={type} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Administratif {type}</Text>
                  <Text style={styles.pricePerHour}>{pricePerHour}€ / h</Text>
                </View>
                <View style={styles.sessionItem}>
                  <Text style={styles.text}>
                    Durée: {formatHoursAndQuarters(roundedDuration)}
                  </Text>
                  <Text style={styles.total}>{totalPrice.toFixed(2)}€</Text>
                </View>
              </View>
            );
          })}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total HT</Text>
            <Text style={styles.summaryValue}>{subtotal.toFixed(2)}€</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TVA (0%)</Text>
            <Text style={styles.summaryValue}>
              {(subtotal * VAT_RATE).toFixed(2)}€
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.grandTotal]}>
              Total TTC
            </Text>
            <Text style={[styles.summaryValue, styles.grandTotal]}>
              {(subtotal * (1 + VAT_RATE)).toFixed(2)}€
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            Merci de votre confiance. Pour toute question, n'hésitez pas à nous
            contacter.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

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
