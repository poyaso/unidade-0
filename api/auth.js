export default async function handler(req, res) {
        const { token, l, c } = req.query;
        if (!token) return res.redirect('/?error=no_token');

  const lang = l || 'pt';
        const country = c || 'BR';
        const subdomain = lang === 'en' ? 'www' : lang;
        const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();

  let kasession = '';

  try {
            const r = await fetch(
                        `https://${subdomain}.khanacademy.org/api/internal/graphql/getFullUserProfile?lang=${lang}&app=khanacademy`,
                  {
                                method: 'POST',
                                headers: {
                                                'Content-Type': 'application/json',
                                                'x-ka-fkey': '1',
                                                'Cookie': `fkey=1; transfer_auth_token=${token}`,
                                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                },
                                body: JSON.stringify({
                                                operationName: 'getFullUserProfile',
                                                query: 'query getFullUserProfile { currentUser { id } }',
                                                variables: {}
                                })
                  }
                      );
            const raw = r.headers.get('set-cookie') || '';
            if (raw.includes('KAAS=')) {
                        kasession = raw.split(',')
                          .map(s => s.trim().split(';')[0])
                          .filter(s => s.startsWith('KAAS=') || s.startsWith('fkey='))
                          .join('; ');
            }
  } catch(e) {}

  const cookies = [
            `u0_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Expires=${expires}`,
            `u0_lang=${lang}; Path=/; SameSite=Lax; Expires=${expires}`,
            `u0_country=${country}; Path=/; SameSite=Lax; Expires=${expires}`
          ];
        if (kasession) {
                  cookies.push(`u0_kasession=${encodeURIComponent(kasession)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`);
        }

  res.setHeader('Set-Cookie', cookies);
        return res.redirect('/dashboard');
}
