// This code runs securely on Vercel's servers.

export const config = {
    runtime: 'edge', // This makes it run super fast and cheap on Vercel
};

export default async function handler(request) {
    // 1. CORS Headers (Allows your game to talk to this endpoint)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        // 2. Get the full prompt from your frontend (main.js)
        const { prompt } = await request.json();
        
        // 3. Access the SECRET key from Vercel's Environment Variables
        // This key is HIDDEN from everyone!
        const GEMINI_KEY = process.env.GEMINI_API_KEY; 
        
        // 4. Forward the secure request to Google
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 5. Send the response back to your game
        return new Response(JSON.stringify(data), { headers });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
