import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

type TimelineStatus = "done" | "live" | "upcoming";

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  owner: string;
  status: TimelineStatus;
}

interface TravelerItem {
  id: string;
  name: string;
  group: string;
  checkedIn: boolean;
}

const timeline: TimelineItem[] = [
  {
    id: "T1",
    time: "08:00",
    title: "Depart from hotel",
    owner: "Lead guide",
    status: "done",
  },
  {
    id: "T2",
    time: "09:30",
    title: "Marble Mountain stop",
    owner: "Guide A",
    status: "live",
  },
  {
    id: "T3",
    time: "11:45",
    title: "Lunch in Hoi An",
    owner: "Guide B",
    status: "upcoming",
  },
  {
    id: "T4",
    time: "14:00",
    title: "Old town walking route",
    owner: "Lead guide",
    status: "upcoming",
  },
];

const travelers: TravelerItem[] = [
  { id: "P1", name: "Nguyen Minh Anh", group: "Bus A", checkedIn: true },
  { id: "P2", name: "Tran Hai Duong", group: "Bus A", checkedIn: true },
  { id: "P3", name: "Le Quang Huy", group: "Bus B", checkedIn: false },
  { id: "P4", name: "Pham Gia Bao", group: "Bus B", checkedIn: true },
  { id: "P5", name: "Vu Ngoc Mai", group: "Bus B", checkedIn: false },
];

const statusColors: Record<TimelineStatus, string> = {
  done: "#2e7d32",
  live: "#ed6c02",
  upcoming: "#5f6368",
};

export default function App() {
  const checkedInCount = travelers.filter((traveler) => traveler.checkedIn).length;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pathora Guide Console</Text>
          <Text style={styles.subtitle}>Tour VN-DN-0312 | Live operation</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Current tour status</Text>
          <View style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>Route</Text>
              <Text style={styles.metricValue}>{"Da Nang -> Hoi An"}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Bus</Text>
              <Text style={styles.metricValue}>29B-567.89</Text>
            </View>
          </View>
          <View style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>Travelers</Text>
              <Text style={styles.metricValue}>24 guests</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Checked in</Text>
              <Text style={styles.metricValue}>
                {checkedInCount}/{travelers.length} tracked
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today timeline</Text>
          {timeline.map((item) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timelineHead}>
                <Text style={styles.timelineTime}>{item.time}</Text>
                <View style={[styles.badge, { backgroundColor: statusColors[item.status] }]}>
                  <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.timelineTitle}>{item.title}</Text>
              <Text style={styles.timelineOwner}>Owner: {item.owner}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Check-in scan</Text>
              <Text style={styles.actionDescription}>Mark attendance quickly.</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Broadcast note</Text>
              <Text style={styles.actionDescription}>Send updates to all guides.</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Emergency call</Text>
              <Text style={styles.actionDescription}>Contact operation center.</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionTitle}>Delay report</Text>
              <Text style={styles.actionDescription}>Push ETA change to team.</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Traveler watchlist</Text>
          {travelers.map((traveler) => (
            <View key={traveler.id} style={styles.travelerRow}>
              <View>
                <Text style={styles.travelerName}>{traveler.name}</Text>
                <Text style={styles.travelerGroup}>{traveler.group}</Text>
              </View>
              <Text
                style={[
                  styles.travelerStatus,
                  traveler.checkedIn ? styles.checkedIn : styles.missing,
                ]}
              >
                {traveler.checkedIn ? "Checked" : "Missing"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#102030",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  header: {
    marginTop: 4,
    marginBottom: 6,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#d6e4f0",
    marginTop: 4,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b2b3a",
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  metricLabel: {
    color: "#4f6376",
    fontSize: 12,
  },
  metricValue: {
    color: "#152a3d",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  timelineRow: {
    borderWidth: 1,
    borderColor: "#dce4eb",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  timelineHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  timelineTime: {
    color: "#1a3348",
    fontWeight: "700",
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  timelineTitle: {
    color: "#1d2c3a",
    fontSize: 14,
    fontWeight: "600",
  },
  timelineOwner: {
    color: "#4f6376",
    fontSize: 12,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#d4dde6",
    borderRadius: 10,
    padding: 10,
    width: "48%",
    minHeight: 80,
    justifyContent: "center",
  },
  actionTitle: {
    color: "#1a3042",
    fontWeight: "700",
    marginBottom: 4,
  },
  actionDescription: {
    color: "#5c7082",
    fontSize: 12,
    lineHeight: 16,
  },
  travelerRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f3",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  travelerName: {
    color: "#1c3145",
    fontSize: 14,
    fontWeight: "600",
  },
  travelerGroup: {
    color: "#607487",
    fontSize: 12,
    marginTop: 2,
  },
  travelerStatus: {
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  checkedIn: {
    backgroundColor: "#dcf4e4",
    color: "#196b34",
  },
  missing: {
    backgroundColor: "#fee8e8",
    color: "#a22b2b",
  },
});
