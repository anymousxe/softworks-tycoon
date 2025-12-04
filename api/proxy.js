// api/proxy.js
export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // 1. Define CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    // 2. Handle Options (Pre-flight requests)
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    // 3. Reject non-POST requests
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { prompt } = await request.json();
        
        // 4. Get Key from Vercel Environment Variables
        const GEMINI_KEY = process.env.GEMINI_API_KEY; 
        
        if (!GEMINI_KEY) {
             throw new Error("Server Error: API Key not configured in Vercel.");
        }

        // 5. Call Gemini 1.5 Flash (STABLE & FREE TIER FRIENDLY)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 6. Return Data
        return new Response(JSON.stringify(data), { headers });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
