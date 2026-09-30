export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).json({ error: 'Server configuration missing' });
    }

    // Handle GET (Fetch Feedbacks)
    if (req.method === 'GET') {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            const data = await response.json();
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch feedback' });
        }
    }

    // Handle POST (Submit Feedback)
    if (req.method === 'POST') {
        try {
            const newEntry = req.body;
            const response = await fetch(`${SUPABASE_URL}/rest/v1/feedbacks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) throw new Error('Failed to insert');
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(500).json({ error: 'Failed to post feedback' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
