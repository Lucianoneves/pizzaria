# Frontend — Pizzaria +++ Sabor

Painel web do **admin/cozinha**. Faz parte do monorepo.

A documentação **global** (backend, frontend e app do garçom) está no [README da raiz](../README.md).

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Server Actions + cookie JWT (`token-pizzaria`)
- Consome a API em `http://127.0.0.1:3333`

## Como rodar

O backend precisa estar ligado (`cd backend && npm run dev`).

```bash
cd frontend
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Opcional — `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:3333
```

## Rotas atuais

| Rota | Função |
| --- | --- |
| `/register` | Cadastro |
| `/login` | Login (ADMIN vai para o dashboard) |
| `/dashboard` | Pedidos da cozinha |
| `/dashboard/products` | Produtos e upload de imagem |
| `/dashboard/category` | Categorias |
| `/access-denied` | STAFF sem permissão no painel |

Só **ADMIN** entra em `/dashboard/**`. Usuário novo nasce como `STAFF`; promova no banco se for usar o painel.

## Pastas principais

```
frontend/src/
├── actions/      # login, categorias, produtos, pedidos
├── app/          # rotas (App Router)
├── components/   # dashboard, forms, UI
└── lib/          # apiClient, auth, tipos
```

---

**Atualizado em:** 23/09/2026
