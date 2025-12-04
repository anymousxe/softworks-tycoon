// api/proxy.js
export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // 1. CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers });

    try {
        const { prompt } = await request.json();
        
        // Use the Server-Side Environment Variable
        const GEMINI_KEY = process.env.GEMINI_API_KEY; 
        
        if (!GEMINI_KEY) throw new Error("Server Error: API Key not configured.");

        // SWITCHED TO GEMINI 3 FLASH (The new Unlimited/Fast Standard)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini 3 Error:", data);
            return new Response(JSON.stringify({ error: data.error?.message || "AI Error" }), { status: 500, headers });
        }

        return new Response(JSON.stringify(data), { headers });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}
