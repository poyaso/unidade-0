async function kaQuery(token, lang, operationName, query) {
  const host = lang === 'en' ? 'www' : lang;
  const url = `https://${host}.khanacademy.org/api/internal/graphql/${operationName}?lang=${lang}&app=khanacademy`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ka-fkey': '1',
      'Cookie': `fkey=1; transfer_auth_token=${token}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Origin': `https://${host}.khanacademy.org`,
      'Referer': `https://${host}.khanacademy.org/`,
    },
    body: JSON.stringify({ operationName, query, variables: {} }),
  });
  return res.json();
}

export default async function handler(req, res) {
  const { token, l, c } = req.query;
  if (!token) return res.redirect('/?error=no_token');

  const lang = l || 'pt';
  const country = c || 'BR';
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();

  let userData = null;
  let coursesData = [];

  try {
    const [userRes, classroomRes] = await Promise.all([
      kaQuery(token, lang, 'getFullUserProfile',
        'query getFullUserProfile { currentUser { id username nickname email points } }'
      ),
      kaQuery(token, lang, 'getStudentClassrooms',
        `query getStudentClassrooms {
          studentClassrooms {
            edges { node {
              title
              assignmentList { edges { node {
                title description
                currentMastery { percentage }
                children { title kind relativeUrl currentMastery { percentage } }
              }}}
            }}
          }
        }`
      ),
    ]);

    userData = userRes?.data?.currentUser || null;

    const edges = classroomRes?.data?.studentClassrooms?.edges || [];
    coursesData = edges.map(e => ({
      title: e.node.title,
      unitChildren: (e.node.assignmentList?.edges || []).map(a => ({
        title: a.node.title,
        description: a.node.description,
        currentMastery: a.node.currentMastery,
        children: a.node.children || [],
      })).filter(u => u.title),
    })).filter(c => c.unitChildren.length > 0);
  } catch (err) {
    // proceed without data — dashboard will show empty state
  }

  const payload = JSON.stringify({ user: userData, courses: coursesData });

  res.setHeader('Set-Cookie', [
    `u0_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_lang=${lang}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_country=${country}; Path=/; SameSite=Lax; Expires=${expires}`,
    `u0_data=${encodeURIComponent(payload)}; Path=/; SameSite=Lax; Expires=${expires}`,
  ]);

  return res.redirect('/dashboard');
}
