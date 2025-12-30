import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalAI } from "../hooks/useLocalAI";
export default function PromptWindow({ navigation }: any) {
    const [prompt, setPrompt] = useState("");
    const { result, loading, error, sendPrompt, reset, requestId
    } = useLocalAI();

    async function handleUpload() { 
        try { 
            const result = await DocumentPicker.getDocumentAsync({ 
                type: "text/plain", copyToCacheDirectory: true }); 
                if (result.canceled) 
                    return; 
                const fileUri = result.assets[0].uri; 
                const content = await fetch(fileUri).then(res => res.text()); 
                setPrompt(content.slice(0, 2000)); 
            } catch (err) { 
                console.log("File upload failed:", err);
             } }
    return (
        <View style={styles.container}> {/* Prompt input */}
            <Text style={styles.label}>Enter Prompt</Text>
            <TextInput style={styles.input} placeholder="Type your prompt..." placeholderTextColor="#555" value={prompt} onChangeText={setPrompt} multiline />
            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.sendButton} onPress={() => sendPrompt(prompt)} disabled={loading} >
                    <Text style={styles.sendButtonText}> {loading ? "Sending..." : "Send Prompt"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} >
                    <Text style={styles.uploadButtonText}>Upload File</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={reset} >
                    <Text style={styles.cancelButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>
            {/* Result */}
            <Text style={styles.sectionTitle}>Agent Response</Text>
            <ScrollView style={styles.resultBox}>
                <Text style={styles.resultText}> {result || "Ready. Enter a prompt or upload a file."}
                </Text>
            </ScrollView> {/* Show Analytics button */}
            {requestId && !loading && (
                <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate("Analytics", { requestId })} >
                    <Text style={styles.analyticsButtonText}>Show Analytics</Text>
                </TouchableOpacity>)} {error ?
                    <Text style={styles.errorText}>{error}</Text> : null}
        </View>);

}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f1115", padding: 16 },
    label: { color: "#9aa6b2", marginBottom: 6, fontSize: 14 },
    input: {
        backgroundColor: "#1b1f24", color: "#e6eef6",
        padding: 12, borderRadius: 8, minHeight: 80, textAlignVertical: "top", marginBottom: 12
    },
    buttonRow: { flexDirection: "row", marginBottom: 12 },
    sendButton: { backgroundColor: "#4fb0ff", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6, marginRight: 8 },
    sendButtonText: { color: "#0b1220", fontWeight: "bold" },
    uploadButton: { backgroundColor: "#333", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6, marginRight: 8 },
    uploadButtonText: { color: "#e6eef6" },

    cancelButton: {
        backgroundColor: "#b03a3a",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6
    },
    cancelButtonText: {
        color: "#fff"
    },
    sectionTitle: {
        color: "#9aa6b2",
        marginTop: 10,
        marginBottom: 6,
        fontSize: 14
    },
    resultBox: {
        backgroundColor: "#121417",
        padding: 12,
        borderRadius: 8,
        flex: 1
    },
    resultText: {
        color: "#e6eef6",
        fontSize: 15,
        lineHeight: 22
    },
    analyticsButton: {
        backgroundColor: "#4fb0ff",
        padding: 12,
        borderRadius: 8,
        marginTop: 12
    },
    analyticsButtonText: {
        color: "#0b1220",
        fontWeight: "bold",
        textAlign: "center"
    },
    errorText: {
        color: "#ff6b6b",
        marginTop: 10
    }
});