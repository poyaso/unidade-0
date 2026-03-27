export default function handler(req, res) {
  const { token, l, c } = req.query;
  if (!token) return res.redirect('/?error=no_token');

  const lang = l || 'pt';
  const country = c || 'BR';
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();

  res.setHeader('Set-Cookie', [
    `u0_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_lang=${lang}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_country=${country}; Path=/; SameSite=Lax; Expires=${expires}`
  ]);

  return res.redirect('/dashboard');
}
