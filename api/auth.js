export default function handler(req, res) {
  const { token, l, c } = req.query;

  if (!token) {
    return res.redirect('/?error=no_token');
  }

  // Store token + locale in a session cookie (httpOnly, 8h expiry)
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();
  res.setHeader('Set-Cookie', [
    `u0_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`,
    `u0_lang=${l || 'pt'}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_country=${c || 'BR'}; Path=/; SameSite=Lax; Expires=${expires}`
  ]);

  return res.redirect('/dashboard');
}
