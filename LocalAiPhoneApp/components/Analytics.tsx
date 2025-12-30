import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { fetchAnalytics } from "../services/api";

export default function Analytics({ route, navigation }: any) {
    const { requestId } = route.params;
    const [analyticsText, setAnalyticsText] = useState("Loading analytics...");
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {

            try {
                const data = await fetchAnalytics(requestId); // Build analytics text (simple version — hook already does heavy parsing) 
                const summary = data.summary || {};
                const events = data.events || [];
                const lines: string[] = [];
                lines.push(`Request ID: ${summary.request_id}`);
                lines.push(`Model: ${summary.model}`);
                lines.push(`Latency ms: ${summary.latency_ms}`);
                lines.push(`Tokens: ${summary.tokens}`);
                lines.push(`Start: ${summary.start_ts}`);
                lines.push(`End: ${summary.end_ts}`);
                lines.push("");
                lines.push("Events (last 10):");
                for (
                    const ev of events.slice(-10)) {
                    const short = ev.raw_line?.slice(0, 200) || ""; lines.push(`${ev.ts} | ${short}`);
                }
                setAnalyticsText(lines.join("\n"));
            }
            catch (err: any) {
                setError("Failed to load analytics");
                setAnalyticsText("");
            }
        } load();
    }, [requestId]);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Analytics</Text>
            <ScrollView style={styles.box}>
                <Text style={styles.text}> {analyticsText || "No analytics available."} </Text>
            </ScrollView> {error ?
                <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>);
}
const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: "#0f1115", padding: 16 }, 
     title: { color: "#e6eef6", fontSize: 20, fontWeight: "bold", marginBottom: 12 }, 
     box: { backgroundColor: "#121417", padding: 12, borderRadius: 8, flex: 1 }, 
     text: { color: "#9aa6b2", fontSize: 14, lineHeight: 20 }, 
     error: { color: "#ff6b6b", marginTop: 10 }, 
     backButton: { backgroundColor: "#4fb0ff", padding: 12, borderRadius: 8, marginTop: 12 }, 
     backButtonText: { color: "#0b1220", fontWeight: "bold", textAlign: "center" }
     }
    );