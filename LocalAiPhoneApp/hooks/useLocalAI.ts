import { useState, useCallback } from "react";
import { sendPrompt, fetchAnalytics, reset } from "../services/api"

function formatTextForDisplay(text: string): string {
    if (!text) return "";
    let t = text; // 1) Normalize whitespace 
    t = t.replace(/\s+/g, " ").trim(); // 2) Remove space before punctuation 
    t = t.replace(/\s+([,.;:!?])/g, "$1"); // 3) Clean quotes 
    t = t.replace(/\s*"\s*([^"]+?)\s*"\s*/g, ` "$1" `); // 4) Add line breaks after punctuation 
    t = t.replace(/([.!?;:])\s+/g, "$1\n\n"); // 5) Remove excessive newlines 
    t = t.replace(/\n{3,}/g, "\n\n");
    return t.trim();
}
function parseAnalytics(data: any) {
    if (!data) return { text: "", analyticsText: "" };
    const summary = data.summary || {};
    const events = data.events || [];
    const reconstructedParts: string[] = [];
    const parsedEvents: any[] = [];
    for (const ev of events) {
        let parsed: any = null;
        try {
            parsed = JSON.parse(ev.raw_line || "{}");

        }
        catch {
            parsed = { response: ev.raw_line };
        }
        const resp = parsed?.response || parsed?.text || "";
        const cleaned = String(resp).trim();
        if (cleaned) reconstructedParts.push(cleaned);
        parsedEvents.push({ ts: ev.ts, response: cleaned, done: parsed?.done, done_reason: parsed?.done_reason });
    }

    let reconstructed = reconstructedParts.join(" ");
    reconstructed = reconstructed.replace(/\s+([,.;:!?])/g, "$1");
    reconstructed = reconstructed.replace(/\s+/g, " ").trim();
    // Build analytics text 
    const lines: string[] = [];
    lines.push(`Request ID: ${summary.request_id}`);
    lines.push(`Model: ${summary.model}`);
    lines.push(`Latency ms: ${summary.latency_ms}`);
    lines.push(`Tokens: ${summary.tokens}`);
    lines.push(""); lines.push("Events (last 10):");
    for (const ev of parsedEvents.slice(-10)) {
        const short = ev.response.length > 200 ? ev.response.slice(0, 200) + "..." : ev.response; lines.push(`${ev.ts} | done=${ev.done} (${ev.done_reason || ""}) | ${short}`);
    } return { text: reconstructed, analyticsText: lines.join("\n") };
}

export function useLocalAI() {
    const [result, setResult] = useState("");
    const [analytics, setAnalytics] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const send = useCallback(async (prompt: string) => {
        setLoading(true); setError("");
        setResult("Waiting for response...");
        setAnalytics("Fetching analytics...");
        try {
            const data = await sendPrompt(prompt);
            const text = formatTextForDisplay(data.text || "");
            setResult(text);
            if (data.request_id) {
                setRequestId(data.request_id);
                try {
                    const stats = await fetchAnalytics(data.request_id);
                    const parsed = parseAnalytics(stats);
                    setAnalytics(parsed.analyticsText);
                    if (parsed.text) setResult(formatTextForDisplay(parsed.text));
                } catch (err) {
                    setAnalytics("Analytics fetch failed");
                }
            } else {
                setAnalytics("No request_id returned");
            }
        } catch (err: any) {
            setError(String(err));
            setResult("Request failed");
            setAnalytics("No analytics available");
        } finally {
            setLoading(false);
        }
    }, []);

    const doReset = useCallback(async () => {
        try {
            await reset();
            setResult("Reset done.");
            setAnalytics("Ready.");
            setRequestId(null);
        } catch (err) {
            setError("Reset failed");
        }
    }, []);
    return { result, analytics, loading, error, requestId, sendPrompt: send, reset: doReset };

}