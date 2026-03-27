export default function handler(req, res) {
  const { token, l, c, data } = req.query;
  if (!token) return res.redirect('/?error=no_token');

  const lang = l || 'pt';
  const country = c || 'BR';
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();

  const cookies = [
    `u0_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_lang=${lang}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_country=${country}; Path=/; SameSite=Lax; Expires=${expires}`,
  ];

  // If full data was passed, store it too
  if (data) {
    cookies.push(`u0_data=${encodeURIComponent(data)}; Path=/; SameSite=Lax; Expires=${expires}`);
  }

  res.setHeader('Set-Cookie', cookies);
  return res.redirect('/dashboard');
}
