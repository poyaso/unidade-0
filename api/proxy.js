export default async function handler(req, res) {
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

  const body = req.body || {};
    const { operationName } = body;

  if (!operationName) {
        return res.status(400).json({ error: 'operationName required' });
  }

  const subdomain = lang === 'en' ? 'www' : lang;
    const kaUrl = `https://${subdomain}.khanacademy.org/api/internal/graphql/${operationName}?lang=${lang}&app=khanacademy`;

  try {
        const kaRes = await fetch(kaUrl, {
                method: 'POST',
                headers: {
                          'Content-Type': 'application/json',
                          'x-ka-fkey': '1',
                          'Cookie': `fkey=1; transfer_auth_token=${token}`,
                          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                body: JSON.stringify(body)
        });

      const data = await kaRes.json();
        res.status(kaRes.status).json(data);
  } catch (err) {
        res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
