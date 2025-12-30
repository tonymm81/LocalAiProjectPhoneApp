// src/services/api.ts 
export const PROXY_URL = "http://192.168.68.126:8080";
export const MODEL = "pixtral-12b-q2:latest";
export interface GenerateResponse {
    text?: string;
    request_id?:
    string;[key: string]: any;
}
export interface AnalyticsResponse {
    summary?: any;
    events?: any[];[key: string]: any;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
    try {
        const resp = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        } return (await resp.json()) as T;
    } catch (err) {
        console.error("API error:", err);
        throw err;
    }
}
export async function sendPrompt(prompt: string): Promise<GenerateResponse> {
    const payload = { model: MODEL, prompt, max_tokens: 512, temperature: 0.0 };
    return await request<GenerateResponse>(`${PROXY_URL}/generate`, {
        method: "POST", body: JSON.stringify(payload)

    }
    );
} export async function fetchAnalytics(requestId: string): Promise<AnalyticsResponse> {
    return await request<AnalyticsResponse>(`${PROXY_URL}/requests/${requestId}`,
        { method: "GET" });
} export async function reset(): Promise<void> {
    try {
        await request(`${PROXY_URL}/admin/reset`, { method: "POST" });
    } catch (err) {
        console.error("Reset failed:", err); throw err;
    }

}