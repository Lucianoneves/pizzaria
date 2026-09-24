# Pizzaria +++ Sabor

Sistema full stack de gestão de pizzaria em monorepo: API, painel web (admin/cozinha) e app mobile do garçom.

---

## Por que este projeto?

Simular um cenário real de operação de pizzaria, com papéis e dispositivos diferentes:

| Quem | Onde | O que faz |
| --- | --- | --- |
| Garçom (`STAFF`) | App mobile | Abre mesa, monta pedido e envia à cozinha |
| Admin / cozinha (`ADMIN`) | Painel web | Gerencia cardápio e acompanha/finaliza pedidos |
| Sistema | API central | Autentica, valida e persiste tudo |

A ideia é separar responsabilidades: o salão trabalha no celular, a cozinha no navegador, e ambos falam com a mesma API.

```
Celular (appPizzaria) ──┐
                         ├──► Backend Express :3333 ──► PostgreSQL
Navegador (frontend)  ──┘                    └──► Cloudinary (fotos)
```

---

## Por que monorepo?

Três apps, um domínio. Manter `backend/`, `frontend/` e `appPizzaria/` juntos facilita:

- alinhar tipos e fluxos de pedido
- documentar o sistema inteiro em um só lugar
- desenvolver e testar a integração ponta a ponta

Detalhes técnicos da API: [`CONTEXTO_PROJETO.md`](./CONTEXTO_PROJETO.md).

---

## Stacks e por quê

| Pasta | Função | Stack | Por quê |
| --- | --- | --- | --- |
| [`backend/`](./backend) | API REST | Express, Prisma, PostgreSQL, JWT, Zod, Cloudinary | API única, tipada e validada; Postgres para pedidos/relacionais; JWT para sessão; Cloudinary para imagens de produto |
| [`frontend/`](./frontend) | Painel ADMIN | Next.js, React, TypeScript, Tailwind, Server Actions | Dashboard web rápido, rotas protegidas e cookie httpOnly |
| [`appPizzaria/`](./appPizzaria) | App STAFF | Expo, React Native, Expo Router, Axios, AsyncStorage | App nativo no celular (Expo Go), fluxo do garçom no salão |

**Em resumo das escolhas:**

- **TypeScript** em todo o projeto → menos erro de contrato entre app, web e API  
- **Prisma + PostgreSQL** → modelo claro (User, Category, Product, Order, Item)  
- **JWT** → mesma autenticação no web (cookie) e no mobile (AsyncStorage)  
- **Zod** → validação de body/query antes de chegar no service  
- **Cloudinary** → upload de banner de produto sem guardar arquivo local  
- **Expo Router** → navegação por pastas (login, dashboard, order, finish)

---

## Funcionalidades (resumo)

### Backend
- Cadastro e login (`POST /users`, `POST /session`)
- Papéis `ADMIN` e `STAFF`
- CRUD de categorias e produtos (produto com imagem)
- Pedidos: abrir, adicionar/remover item, detalhar, enviar, finalizar, apagar

### Frontend (admin/cozinha)
- Login/cadastro
- Categorias e produtos (com upload)
- Lista de pedidos em produção (`draft=false`, `status=false`)
- Modal de detalhes e finalização do pedido (`PUT /order/finish`)

### App do garçom
- Login com JWT
- Abrir mesa (`POST /order`)
- Montar pedido: categoria → produto → quantidade
- Adicionar/remover itens
- Enviar à cozinha (`PUT /order/send`)

---

## Ciclo do pedido

1. **Abrir mesa** → `POST /order` → `draft: true` (rascunho)
2. **Montar itens** → `POST /order/add` / `DELETE /order/remove`
3. **Enviar à cozinha** → `PUT /order/send` → `draft: false`
4. **Finalizar na cozinha** → `PUT /order/finish` → `status: true`

Por isso o painel lista `draft=false` (já enviados). Pedidos ainda no app (`draft=true`) não aparecem na cozinha.

---

## Papéis

| Role | Painel web | App Expo |
| --- | --- | --- |
| `ADMIN` | Dashboard completo | Pode logar |
| `STAFF` | `/access-denied` | App do garçom |

Cadastro cria `STAFF`. Para o painel:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

---

## Como rodar

Requisitos: **Node.js 18+**, **PostgreSQL**, **Expo Go** (celular).

### 1. Backend — `http://127.0.0.1:3333`

```bash
cd backend
npm install
```

`.env`:

```bash
PORT=3333
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_TOKEN="chave-secreta-do-jwt"
CLOUDINARY_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_SECRET="seu-api-secret"
```

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 2. Frontend — `http://localhost:3000`

```bash
cd frontend
npm install
npm run dev
```

Opcional (`.env.local`): `NEXT_PUBLIC_API_URL=http://127.0.0.1:3333`

### 3. App — Expo Go

```bash
cd appPizzaria
npm install
npx expo start
```

Em `appPizzaria/config/api.config.ts`, use o IP do PC:

```ts
BASE_URL: "http://SEU_IP_LOCAL:3333"
```

Celular e PC na mesma Wi-Fi. `localhost` no celular não alcança o backend.

---

## API (atalho)

Auth: `Authorization: Bearer <token>` nas rotas protegidas.

| Método | Rota | Uso |
| --- | --- | --- |
| POST | `/users` | Cadastro |
| POST | `/session` | Login |
| GET | `/me` | Perfil |
| GET / POST | `/category` | Listar / criar categoria |
| GET | `/category/product?category_id=` | Produtos da categoria |
| GET / POST / DELETE | `/product` | Produtos |
| POST / GET | `/order` | Abrir / listar (`?draft=true\|false`) |
| POST | `/order/add` | Item (`order_id`, `product_id`, `amount`) |
| DELETE | `/order/remove?item_id=` | Remover item |
| GET | `/order/detail?order_id=` | Detalhe |
| PUT | `/order/send` | Enviar à cozinha |
| PUT | `/order/finish` | Finalizar |
| DELETE | `/order/delete?order_id=` | Apagar pedido |

---

## Estrutura

```
pizzaria/
├── README.md              ← visão geral (este arquivo)
├── CONTEXTO_PROJETO.md    ← detalhes da API
├── backend/               ← Express + Prisma + PostgreSQL
├── frontend/              ← Next.js (admin / cozinha)
└── appPizzaria/           ← Expo (garçom)
    ├── app/               ← login, dashboard, order, finish
    ├── components/        ← Select, QuantityControl, OrderItem, Button
    ├── contexts/          ← AuthContext
    ├── service/           ← Axios + token
    ├── types/             ← tipagens
    └── utils/             ← formatPrice
```

---

**Atualizado em:** 24/09/2026
