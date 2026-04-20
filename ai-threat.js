// api/ai-threat.js — Vercel Serverless Function
// Proxy για Anthropic API — το key μένει στο Vercel, δεν φαίνεται στο GitHub

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.status(200).end(); return; }
    if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Missing messages array' });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.Travel_Ai_Threat,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 800,
                system: `You are a Travel Security AI Advisor embedded in the "Stay Safe Elite" travel safety app. When a user mentions a country, city, or destination, provide a concise security briefing covering:
1. 🔴 Top security threats (crime, terrorism, civil unrest)
2. 🟡 Common scams targeting tourists
3. 🏥 Health & medical risks
4. ⚠️ Areas / neighbourhoods to avoid
5. ✅ Key safety tips

Use short bullet points with relevant emojis. Be factual, helpful, and not alarmist. If no destination is mentioned, ask which country or city they want to know about. Keep responses under 300 words.`,
                messages
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to contact AI service' });
    }
}
