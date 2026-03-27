# unidade 0 — para Khan Academy
> Interface temática de Neon Genesis Evangelion para o Khan Academy

## Deploy na Vercel (passo a passo)

### 1. Instale o Vercel CLI (opcional, mas mais fácil)
```bash
npm install -g vercel
```

### 2. Faça login na Vercel
```bash
vercel login
```

### 3. Suba o projeto
Na pasta do projeto (`unidade0/`):
```bash
vercel --prod
```

A Vercel vai te dar um domínio tipo `unidade0.vercel.app`.

---

### Alternativa: Deploy pelo GitHub (sem instalar nada)

1. Crie um repositório no GitHub e suba esta pasta
2. Acesse [vercel.com](https://vercel.com) → "New Project"
3. Conecte o repositório
4. Clique em Deploy — pronto!

---

## Como usar após o deploy

1. Acesse seu domínio (ex: `https://unidade0.vercel.app`)
2. **Arraste o botão "UNIDADE 0 LOGIN"** para sua barra de favoritos
3. Vá para [pt.khanacademy.org](https://pt.khanacademy.org) e faça login normalmente
4. Clique no favorito salvo
5. Você será redirecionado para o dashboard do unidade 0!

---

## Estrutura do projeto
```
unidade0/
├── vercel.json          # Configuração de rotas
├── package.json
├── api/
│   ├── auth.js          # Recebe token e cria cookie de sessão
│   └── proxy.js         # Proxy para a API da Khan Academy
└── public/
    ├── index.html       # Página de login (tema EVA)
    └── dashboard.html   # Dashboard completo
```

## Como funciona
- O bookmarklet captura o token de transferência da Khan Academy
- Envia para `/api/auth` que salva em cookie httpOnly seguro
- `/dashboard` carrega seus cursos e unidades direto da API da KA
- Nenhuma senha é armazenada
