# Impulse+ — Frontend

Interface em React (Vite) conectada ao backend real: login/cadastro gravam no banco, flashcards/resumos/quiz vêm da API, e o Desafio em grupo roda ao vivo por Socket.IO.

## Rodando localmente

**Pré-requisito:** o backend (`impulse-backend`) já rodando em `http://localhost:4000` (veja o README dele: `npm install`, `npm run seed`, `npm start`).

Em outro terminal:

```bash
cd impulse-frontend
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`. Cadastre-se — o registro vai ser salvo de verdade no `impulse.db` do backend.

## Testando o Desafio em grupo com um colega

1. Abra a plataforma em duas abas/computadores diferentes (ambos apontando pro mesmo backend).
2. Em uma aba, vá em Quiz → "Desafio em grupo" → "Criar uma sala" → anote o código.
3. Na outra aba, "Desafio em grupo" → digite o código → "Entrar".
4. Quem criou a sala vê o botão "Iniciar desafio". Todo mundo responde ao mesmo tempo, com ranking ao vivo entre perguntas.

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/` — é isso que você sobe em um serviço de hospedagem de site estático (Vercel, Netlify, Render Static Site, GitHub Pages). Lembre de configurar `VITE_API_URL` e `VITE_SOCKET_URL` apontando para a URL pública do backend já publicado.

## Estrutura

```
src/
  api.js       -> chamadas REST para o backend (auth, flashcards, resumos, quiz, xp)
  socket.js    -> conexão Socket.IO para o Desafio em grupo
  App.jsx      -> toda a interface (login, dashboard, flashcards, resumos, quiz, perfil)
  main.jsx     -> ponto de entrada do React
  index.css    -> fontes e reset
```
