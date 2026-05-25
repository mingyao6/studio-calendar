// api/bookings.js — Vercel serverless function
// Keeps your Airtable token server-side, never exposed to the browser.
// Set AIRTABLE_TOKEN in Vercel Dashboard → Settings → Environment Variables.

const BASE_ID = 'appkp7fM309kfaBZp';
const TABLE   = '2025 Clients';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: 'Missing start or end query param' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'AIRTABLE_TOKEN not configured' });
  }

  try {
    const fields = ['Payee Name', 'Date', 'Duration', 'Service', 'Location', 'Status'];
    const fp     = fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&');
    const filter = encodeURIComponent(
      `AND(IS_AFTER({Date},'${start}T00:00:00.000Z'),IS_BEFORE({Date},'${end}T23:59:59.999Z'))`
    );

    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}` +
                `?filterByFormula=${filter}&${fp}`;

    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Airtable error:', err);
      return res.status(r.status).json({ error: 'Airtable request failed' });
    }

    const data = await r.json();

    // Set cache header — 5 min cache, revalidate in background
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
