export default async function handler(req, res) {
  // Parse cookies
  const cookies = Object.fromEntries(
    (req.headers.cookie || '').split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const token = cookies['u0_token'];
  const lang = cookies['u0_lang'] || 'pt';

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { path } = req.query;
  const kaUrl = `https://${lang === 'en' ? 'www' : lang}.khanacademy.org${path ? '/' + (Array.isArray(path) ? path.join('/') : path) : ''}`;

  try {
    const body = req.method !== 'GET' ? JSON.stringify(req.body) : undefined;
    const kaRes = await fetch(kaUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-ka-fkey': '1',
        'Cookie': `fkey=1; transfer_auth_token=${token}`,
        'User-Agent': 'Mozilla/5.0 (compatible; Unidade0/1.0)'
      },
      body
    });

    const data = await kaRes.json();
    res.status(kaRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
