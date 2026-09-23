# Pizzaria +++ Sabor

Monorepo do sistema da pizzaria: API, painel web da cozinha/admin e app mobile do garçom.

| Pasta | O que é | Stack | Porta / acesso |
| --- | --- | --- | --- |
| [`backend/`](./backend) | API REST | Express 5, Prisma 7, PostgreSQL, JWT, Cloudinary | `http://127.0.0.1:3333` |
| [`frontend/`](./frontend) | Painel web (ADMIN) | Next.js 16, React 19, Tailwind, Server Actions | `http://localhost:3000` |
| [`appPizzaria/`](./appPizzaria) | App do garçom (STAFF) | Expo 57, Expo Router, React Native | Expo Go (QR) |

Detalhamento de endpoints, schemas e fluxos: [`CONTEXTO_PROJETO.md`](./CONTEXTO_PROJETO.md).

---

## Visão geral

```
Celular (appPizzaria) ──┐
                         ├──► Backend Express :3333 ──► PostgreSQL
Navegador (frontend)  ──┘                    └──► Cloudinary (fotos de produto)
```

- **ADMIN** gerencia categorias, produtos e acompanha pedidos no dashboard web.
- **STAFF** (garçom) entra pelo app Expo, abre mesa e monta pedidos.
- Novos usuários nascem com role `STAFF`. Para usar o painel web, o role precisa ser `ADMIN` no banco.

Ciclo do pedido:

1. Abrir mesa (`POST /order`) — rascunho (`draft: true`)
2. Adicionar itens (`POST /order/add`)
3. Enviar à cozinha (`PUT /order/send`) — `draft: false`
4. Finalizar (`PUT /order/finish`) — `status: true`

---

## Como rodar

Precisa do **Node.js 18+**, **PostgreSQL** e, para o app, **Expo Go** no celular.

### 1. Backend

```bash
cd backend
npm install
```

Crie `backend/.env`:

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

API em `http://127.0.0.1:3333`.

### 2. Frontend (painel admin)

```bash
cd frontend
npm install
npm run dev
```

Opcional: `frontend/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:3333
```

Abra `http://localhost:3000`.

| Rota | Quem acessa | Função |
| --- | --- | --- |
| `/register` | público | Cadastro (`POST /users`) |
| `/login` | público | Login (`POST /session`) |
| `/dashboard` | ADMIN | Pedidos da cozinha |
| `/dashboard/products` | ADMIN | Produtos + upload de imagem |
| `/dashboard/category` | ADMIN | Categorias |
| `/access-denied` | STAFF logado | Sem permissão no painel |

O token fica no cookie httpOnly `token-pizzaria`.

### 3. App do garçom (`appPizzaria`)

```bash
cd appPizzaria
yarn install
# ou npm install
npx expo start
```

Use **`npx expo start`** (CLI local). O comando global `expo` está depreciado.

No celular, abra o QR com o Expo Go. Celular e PC precisam estar na **mesma Wi-Fi**.

URL da API em `appPizzaria/config/api.config.ts`:

```ts
BASE_URL: "http://SEU_IP_LOCAL:3333"
```

Troque `SEU_IP_LOCAL` pelo IP do PC (o mesmo do Metro, ex.: `192.168.100.37`). Sem a porta `:3333` o login falha com `Network Error`.

No Android, HTTP local está liberado (`usesCleartextTraffic`).

| Tela | Função |
| --- | --- |
| `app/index.tsx` | Redireciona conforme sessão |
| `app/login.tsx` | Login do garçom |
| `app/(authenticated)/dashboard.tsx` | Abrir mesa / novo pedido (`POST /order`) |
| `app/(authenticated)/order.tsx` | Montar pedido da mesa |

Fluxo no app após abrir a mesa:

1. Escolher categoria (`GET /category`)
2. Escolher produto da categoria (`GET /category/product?category_id=...`)
3. Definir quantidade e adicionar item (`POST /order/add`)
4. Remover item da lista, se preciso (`DELETE /order/remove?item_id=...`)

Componentes principais do pedido: `Select`, `QuantityControl`, `OrderItem`, `Button`. Preços em reais via `utils/format.ts` (`formatPrice`).

Sessão: `POST /session` → token em AsyncStorage (`@token:pizzaria`). Rotas autenticadas exigem `signed === true`.

Params da tela de pedido (vindos do dashboard):

```ts
{ table: string; orderId: string }
```

---

## API (resumo)

Auth: `Authorization: Bearer <token>` nas rotas protegidas.

| Método | Rota | Auth | Admin | Uso |
| --- | --- | --- | --- | --- |
| POST | `/users` | não | não | Cadastro |
| POST | `/session` | não | não | Login |
| GET | `/me` | sim | não | Perfil |
| GET / POST | `/category` | sim | POST só admin | Categorias |
| GET | `/category/product` | sim | não | Produtos da categoria |
| GET / POST / DELETE | `/product` | sim | POST/DELETE admin | Produtos (DELETE = soft delete) |
| POST / GET | `/order` | sim | não | Abrir / listar pedidos |
| POST | `/order/add` | sim | não | Item no pedido (`order_id`, `product_id`, `amount`) |
| DELETE | `/order/remove` | sim | não | Remover item |
| GET | `/order/detail` | sim | não | Detalhe |
| PUT | `/order/send` | sim | não | Enviar à cozinha |
| PUT | `/order/finish` | sim | não | Finalizar |
| DELETE | `/order/delete` | sim | não | Apagar pedido |

---

## Papéis

| Role | Frontend web | App Expo |
| --- | --- | --- |
| `ADMIN` | Dashboard completo | Também pode logar |
| `STAFF` | `/access-denied` | App do garçom |

Cadastro cria `STAFF`. Para o painel web, atualize no banco:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

---

## Estrutura

```
pizzaria/
├── README.md                 ← este arquivo
├── CONTEXTO_PROJETO.md       ← documentação detalhada da API
├── backend/                  ← Express + Prisma
├── frontend/                 ← Next.js (admin / cozinha)
└── appPizzaria/              ← Expo (garçom)
    ├── app/                  ← rotas (login, dashboard, order)
    ├── components/           ← Select, QuantityControl, OrderItem, Button
    ├── contexts/             ← AuthContext
    ├── service/              ← cliente Axios
    ├── types/                ← tipos compartilhados
    └── utils/                ← formatPrice
```

---

**Atualizado em:** 23/09/2026
