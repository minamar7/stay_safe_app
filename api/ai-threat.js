// api/ai-threat.js β Vercel Serverless Function
// Proxy Ξ³ΞΉΞ± Gemini 1.5 API β ΟΞΏ key ΞΌΞ­Ξ½Ξ΅ΞΉ ΟΟΞΏ Vercel, Ξ΄Ξ΅Ξ½ ΟΞ±Ξ―Ξ½Ξ΅ΟΞ±ΞΉ ΟΟΞΏ GitHub

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

    const SYSTEM_PROMPT = `You are a Travel Security AI Advisor embedded in the "Stay Safe Elite" travel safety app. When a user mentions a country, city, or destination, provide a concise security briefing covering:
1. π΄ Top security threats (crime, terrorism, civil unrest)
2. π‘ Common scams targeting tourists
3. π₯ Health & medical risks
4. β οΈ Areas / neighbourhoods to avoid
5. β Key safety tips

Use short bullet points with relevant emojis. Be factual, helpful, and not alarmist. If no destination is mentioned, ask which country or city they want to know about. Keep responses under 300 words.`;

    try {
        // Convert message history to Gemini format
        const geminiContents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.Travel_Ai_Threat}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: geminiContents,
                generationConfig: {
                    maxOutputTokens: 800,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();

        // Extract text from Gemini response
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return res.status(500).json({ error: 'Empty response from Gemini' });
        }

        // Return in same format as before so the frontend does not change
        return res.status(200).json({
            content: [{ type: 'text', text }]
        });

    } catch (err) {
        return res.status(500).json({ error: 'Failed to contact AI service' });
    }
}
