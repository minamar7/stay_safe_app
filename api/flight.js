// api/flight.js — Vercel Serverless Function
// Proxy για AviationStack API — το key μένει στο Vercel, δεν φαίνεται στο GitHub

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') { res.status(200).end(); return; }

    const { num } = req.query;
    if (!num) {
        return res.status(400).json({ error: 'Missing flight number' });
    }

    try {
        const url = `https://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATION_API_KEY}&flight_iata=${num.toUpperCase()}&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch flight data' });
    }
}
