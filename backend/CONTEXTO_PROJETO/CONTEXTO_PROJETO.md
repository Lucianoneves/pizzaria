# Documentação de Contexto do Projeto - Sistema de Pizzaria

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Validação com Schemas](#validação-com-schemas)
8. [Endpoints](#endpoints)
9. [Fluxo de Requisição](#fluxo-de-requisição)
10. [Configurações do Projeto](#configurações-do-projeto)

---

## Visão Geral

Sistema backend de gerenciamento de pizzaria desenvolvido em Node.js com TypeScript, utilizando Express como framework web, Prisma ORM 7 (com driver adapter `pg`) para PostgreSQL, Zod para validação, e Cloudinary + Multer para imagem de produto.

---

## Arquitetura

O projeto segue o padrão **MVC + Service Layer**:

```
Requisição HTTP → Rotas → Middlewares → Controller → Service → Prisma (adapter pg) / Cloudinary → Service → Controller → Resposta HTTP
```

### Camadas

1. **Rotas (`src/routes.ts`)**: define os endpoints e encadeia os middlewares
2. **Middlewares**: validação Zod, autenticação JWT, autorização por role e upload Multer
3. **Controllers**: extraem dados da requisição (`body`, `file`, `user_id`) e delegam para o Service
4. **Services**: lógica de negócio, Prisma e upload no Cloudinary
5. **Prisma Client**: gerado em `src/generated/prisma`, instanciado com `@prisma/adapter-pg`

### Princípios

- Separação de responsabilidades por camada
- Um controller/service por operação (`CreateUser`, `AuthUser`, `DetailUser`, `CreateCategory`, `ListCategory`, `CreateProduct`, `ListProduct`, `DeleteProduct`, `ListByCategory`, `CreateOrder`, `ListOrders`, `AddItemOrder`, `RemoveItemOrder`, `DetailOrder`, `SendOrder`, `FinishOrder`, `DeleteOrder`)
- Middlewares reutilizados entre rotas
- Validação centralizada com Zod **depois** do Multer nas rotas `multipart/form-data` (para o `body` já estar preenchido)
- Nomes do Prisma Client seguem o `schema.prisma` (`category_Id`, `createdAt`)

---

## Tecnologias e Versões

Valores conforme o `package.json` atual.

### Dependências de produção

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| **express** | ^5.2.1 | Framework web (API REST) |
| **@prisma/client** | ^7.10.0 | Client do Prisma ORM |
| **@prisma/adapter-pg** | ^7.10.0 | Driver adapter do Prisma 7 para Postgres |
| **pg** | ^8.23.0 | Driver Node.js do PostgreSQL |
| **zod** | ^4.6.2 | Validação de schemas |
| **bcryptjs** | ^3.0.3 | Hash de senhas |
| **jsonwebtoken** | ^9.0.3 | Geração e verificação de JWT |
| **cors** | ^2.8.6 | CORS |
| **dotenv** | ^17.4.2 | Variáveis de ambiente |
| **tsx** | ^4.23.13 | Execução TypeScript em desenvolvimento |
| **multer** | ^2.4.0 | Upload `multipart/form-data` (arquivo em memória) | 
| **cloudinary** | ^2.11.0 | Hospedagem da imagem do produto (`banner`) |

### Dependências de desenvolvimento

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| **typescript** | ^7.0.2 | Compilador TypeScript |
| **prisma** | ^7.10.0 | CLI do Prisma |
| **@types/express** | ^5.0.6 | Tipos do Express |
| **@types/cors** | ^2.8.19 | Tipos do CORS |
| **@types/jsonwebtoken** | ^9.0.10 | Tipos do JWT |
| **@types/node** | ^22.20.2 | Tipos do Node.js |
| **@types/pg** | ^8.23.1 | Tipos do `pg` |
| **@types/multer** | ^2.2.0 | Tipos do Multer |

### Banco de dados

- **PostgreSQL**, acessado via Prisma 7 + adapter `pg`
- A URL de conexão fica em `DATABASE_URL` (`.env`) e é lida pelo `prisma7.config.ts` e por `src/prisma/prisma.ts`

---

## Estrutura de Pastas

```
pizzaria/
├── CONTEXTO_PROJETO/
│   └── CONTEXTO_PROJETO.md
├── prisma/
│   ├── migrations/
│   │   ├── 20260911160024/
│   │   │   └── migration.sql
│   │   ├── 20260914171710_add_order_name/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── @types/
│   │   └── express/
│   │       └── express.d.ts          # Request.user_id
│   ├── config/
│   │   ├── cloudinary.ts             # cloud_name, api_key, api_secret
│   │   └── multer.ts                 # memoryStorage, 5MB, jpeg/png
│   ├── controllers/
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoryController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── ListProductController.ts
│   │   │   ├── ListByCategoryController.ts
│   │   │   └── DeleteProductController.ts
│   │   ├── order/
│   │   │   ├── CreateOrderController.ts
│   │   │   ├── LIstOrdersController.ts   # nome do arquivo (LIst)
│   │   │   ├── AddItemOrderController.ts
│   │   │   ├── RemoveItemOrderController.ts
│   │   │   ├── DetailOrderController.ts
│   │   │   ├── SendOrderController.ts
│   │   │   ├── FinishOrderController.ts
│   │   │   └── DeleteOrderController.ts
│   │   └── user/
│   │       ├── AuthUserController.ts
│   │       ├── CreateUserController.ts
│   │       └── DetailUserController.ts
│   ├── generated/                    # gerado pelo `prisma generate` (gitignore)
│   │   └── prisma/
│   ├── middlewares/
│   │   ├── isAdmin.ts
│   │   ├── isAuthenticated.ts
│   │   └── validateSchema.ts
│   ├── prisma/
│   │   └── prisma.ts                 # PrismaClient + PrismaPg
│   ├── schemas/
│   │   ├── categorySchema.ts
│   │   ├── orderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoryService.ts
│   │   ├── order/
│   │   │   ├── CreateOrderService.ts
│   │   │   ├── LIstOrdersService.ts      # nome do arquivo (LIst)
│   │   │   ├── AddItemOrderService.ts
│   │   │   ├── RemoveItemOrderService.ts
│   │   │   ├── DetailOrderService.ts
│   │   │   ├── SendOrderService.ts
│   │   │   ├── FinishOrderService.ts
│   │   │   └── DeleteOrderService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── ListProductService.ts
│   │   │   ├── ListByCategoryService.ts
│   │   │   └── DeleteProductService.ts
│   │   └── user/
│   │       ├── AuthUserService.ts
│   │       ├── CreateUserService.ts
│   │       └── DetailUserService.ts
│   ├── routes.ts
│   └── server.ts
├── .env
├── package.json
├── prisma7.config.ts
└── tsconfig.json
```

O Prisma Client de runtime está em `src/prisma/prisma.ts`.

### Mapa de controllers e services

| Operação | Controller | Service |
| --- | --- | --- |
| Criar usuário | `CreateUserController` | `CreateUserService` |
| Login | `AuthUserController` | `AuthUserService` |
| Perfil | `DetailUserController` | `DetailUserService` |
| Criar categoria | `CreateCategoryController` | `CreateCategoryService` |
| Listar categorias | `ListCategoryController` | `ListCategoryService` |
| Criar produto | `CreateProductController` | `CreateProductService` |
| Listar produtos | `ListProductController` | `ListProductService` |
| Desativar produto | `DeleteProductController` | `DeleteProductService` |
| Produtos por categoria | `ListByCategoryController` | `ListByCategoryService` |
| Abrir pedido | `CreateOrderController` | `CreateOrderService` |
| Listar pedidos | `ListOrdersController` (`LIstOrdersController.ts`) | `ListOrdersService` (`LIstOrdersService.ts`) |
| Adicionar item | `AddItemOrderController` | `AddItemOrderService` |
| Remover item | `RemoveItemOrderController` | `RemoveItemOrderService` |
| Detalhar pedido | `DetailOrderController` | `DetailOrderService` |
| Enviar à cozinha | `SendOrderController` | `SendOrderService` |
| Finalizar pedido | `FinishOrderController` | `FinishOrderService` |
| Deletar pedido | `DeleteOrderController` | `DeleteOrderService` |

### Convenções de nomenclatura

- Controllers: `<Action><Entity>Controller.ts`
- Services: `<Action><Entity>Service.ts`
- Schemas: `<entity>Schema.ts`
- Middlewares: `isAuthenticated.ts`, `isAdmin.ts`, `validateSchema.ts`
- Exports dos middlewares de auth: `IsAuthenticated` e `IsAdmin`
- Config: `src/config/multer.ts` (default export da instância) e `src/config/cloudinary.ts`

---

## Modelagem do Banco de Dados

Nomes no Prisma Client seguem o `schema.prisma` (camelCase). As tabelas físicas usam `@@map` (`users`, `categories`, `products`, `orders`, `items`).

### Diagrama de relacionamentos

```
User (1) ─────< (N) Order (1) ─────< (N) Item
                                         │
Category (1) ─────< (N) Product (1) ─────┘
```

### User

```
id         String   @id @default(uuid())
name       String
email      String   @unique
password   String
role       String   @default("STAFF")   // valores usados: STAFF | ADMIN
orders     Order[]
createdAt  DateTime @default(now())
updatedAt  DateTime @updatedAt
```

Existe um `enum Role { STAFF ADMIN }` no schema, mas o campo `User.role` é `String`, não o enum.

### Category

```
id         String    @id @default(uuid())
name       String
products   Product[]
createdAt  DateTime  @default(now())
updatedAt  DateTime  @updatedAt
```

### Product

```
id           String   @id @default(uuid())
name         String
price        Float
description  String
banner       String                 // URL do Cloudinary
disabled     Boolean  @default(false)
category_Id  String                 // FK (nome no Prisma)
category     Category
items        Item[]
createdAt    DateTime @default(now())
updatedAt    DateTime @updatedAt
```

O preço é `Float`. O form-data usa `category_id`; o Prisma grava em `category_Id`. `banner` é a `secure_url` do Cloudinary (pasta `products`).

### Order

```
id         String   @id @default(uuid())
table      Int
name       String                   // nome do cliente
status     Boolean  @default(false)  // false = em aberto, true = finalizado
draft      Boolean  @default(true)   // true = rascunho, false = enviado à cozinha
user_Id    String
user       User
items      Item[]
createdAt  DateTime @default(now())
updatedAt  DateTime @updatedAt
```

O `user_Id` vem do JWT (`request.user_id`), não do body.

### Item

```
id          String   @id @default(uuid())
name        String
amount      Int
order_Id    String
order       Order
product_Id  String
product     Product
createdAt   DateTime @default(now())
updatedAt   DateTime @updatedAt
```

### Cascade

- Category deletada → Products relacionados
- Product deletado → Items relacionados
- Order deletado → Items relacionados
- User deletado → Orders relacionados

---

## Middlewares

### 1. IsAuthenticated (`src/middlewares/isAuthenticated.ts`)

Valida o JWT e grava o id do usuário em `request.user_id`.

1. Lê `Authorization`
2. Se não houver header → `401` `{ error: "Token não fornecido" }`
3. Separa `Bearer <token>`
4. `verify(token, process.env.JWT_TOKEN)`
5. `request.user_id = payload.sub`
6. `next()`, ou `401` `{ error: "Token inválido" }`

### 2. IsAdmin (`src/middlewares/isAdmin.ts`)

Deve vir **depois** de `IsAuthenticated`.

1. Lê `request.user_id`
2. Busca o usuário no banco
3. Se não existir ou `role !== "ADMIN"` → `401` `{ error: "Usuario sem permissão" }`
4. `next()`

Usado em `POST /category`, `POST /product` e `DELETE /product`. **Não** é usado nas rotas de listagem, pedido (`/order*`) nem em `POST /users` e `POST /session`.

### 3. validateSchema (`src/middlewares/validateSchema.ts`)

Valida `body`, `query` e `params` com um schema Zod.

- `400` `{ error: "Erro de validação", details: [{ message, path }] }`
- `500` `{ error: "Erro interno do servidor!!! " }` se o erro não for Zod (schema inválido, por exemplo)

Nas rotas com arquivo, o Multer deve rodar **antes** do Zod.

### 4. Multer (`src/config/multer.ts`)

Instância default, usada na rota como `upload.single('file')`.

- `memoryStorage()` (buffer em `request.file.buffer` para o Cloudinary)
- Limite **5MB**
- MIME: `image/jpeg`, `image/jpg`, `image/png`
- Tipo inválido → `Error('Tipo de arquivo inválido')`

O campo do form-data da imagem **tem que se chamar `file`**.

---

## Validação com Schemas

### User (`src/schemas/userSchema.ts`)

**createUserSchema**

```
body.name      string, mínimo 4  → "Nome é obrigatório"
body.email     email             → "Email é obrigatório"
body.password  string, mínimo 4  → "Senha é obrigatória"
```

**authUserSchema**

```
body.email     email             → "Email é obrigatório"
body.password  string, mínimo 4  → "Senha é obrigatória"
```

### Category (`src/schemas/categorySchema.ts`)

**createCategorySchema** (só no POST)

```
body.name  string, mínimo 2
           → "Nome da categoria precisa ser um texto"
           → "Nome da categoria deve ter pelo menos 2 caracteres"
```

`GET /category` não usa schema Zod (não há body).

**listCategoryProductSchema** (GET `/category/product`)

```
query.category_id  string, mínimo 1  → "O id da categoria é obrigatório"
```

### Product (`src/schemas/productSchema.ts`)

**createProductSchema**

Form-data manda tudo como string. Por isso `price` usa `z.coerce.number()`.

```
body.name          string, mínimo 1
body.price         coerce number, mínimo 1
body.description   string, mínimo 1
body.category_id   string opcional
body.category_Id   string opcional
```

`.refine`: precisa existir `category_id` **ou** `category_Id`.

Não valide o arquivo no Zod; o controller exige `request.file`.

**listProductSchema**

Query string (sempre chega como texto):

```
query.disable  "true" | "false"  (opcional; padrão "false")
```

Filtra o campo Prisma `disabled`. Valor inválido (ex.: `disable=sim`) → 400.

**deleteProductSchema**

Query string:

```
query.product_id  string, mínimo 1  → "O id do produto é obrigatório"
query.disable     "true" | "false"  (opcional; padrão "true")
```

O DELETE **não apaga** a linha: atualiza `disabled` no banco. Valor inválido em `disable` → 400.

### Order (`src/schemas/orderSchema.ts`)

**createOrderSchema**

```
body.table  coerce number inteiro, mínimo 1  → "O número da mesa é obrigatório"
body.name   string, mínimo 1                 → "O nome do cliente é obrigatório"
```

O `user_Id` **não** vai no body: o controller lê `request.user_id` do JWT.

**addItemOrderSchema**

```
body.order_id    string, mínimo 1                 → "O id do pedido é obrigatório"
body.product_id  string, mínimo 1                 → "O id do produto é obrigatório"
body.amount      coerce number inteiro, mínimo 1  → "A quantidade é obrigatória"
```

No Prisma grave `order_Id` e `product_Id`. `Item.name` copia o nome do produto.

**removeItemOrderSchema**

```
query.item_id  string, mínimo 1  → "O id do item é obrigatório"
```

**detailOrderSchema**

```
query.order_id  string, mínimo 1  → "O id do pedido é obrigatório"
```

**deleteOrderSchema**

```
query.order_id  string, mínimo 1  → "O id do pedido é obrigatório"
```

**sendOrderSchema**

```
body.order_id  string, mínimo 1  → "O id do pedido é obrigatório"
```

O controller também lê `name` no body, mas o Zod **não** valida `name`.

**finishOrderSchema**

```
body.order_id  string, mínimo 1  → "O id do pedido é obrigatório"
```

`GET /order` não usa schema Zod. Query `draft` é lida no controller (`"true"` → rascunhos; qualquer outro valor ou omitido → `draft = false`).

---

## Endpoints

### Mapa rápido

| Método | Rota | Auth | Admin | Schema | Controller → Service |
| --- | --- | --- | --- | --- | --- |
| POST | `/users` | não | não | `createUserSchema` | `CreateUserController` → `CreateUserService` |
| POST | `/session` | não | não | `authUserSchema` | `AuthUserController` → `AuthUserService` |
| GET | `/me` | sim | não | — | `DetailUserController` → `DetailUserService` |
| GET | `/category` | sim | não | — | `ListCategoryController` → `ListCategoryService` |
| POST | `/category` | sim | sim | `createCategorySchema` | `CreateCategoryController` → `CreateCategoryService` |
| GET | `/category/product` | sim | não | `listCategoryProductSchema` | `ListByCategoryController` → `ListByCategoryService` |
| POST | `/product` | sim | sim | `createProductSchema` | `CreateProductController` → `CreateProductService` |
| GET | `/product` | sim | não | `listProductSchema` | `ListProductController` → `ListProductService` |
| DELETE | `/product` | sim | sim | `deleteProductSchema` | `DeleteProductController` → `DeleteProductService` |
| POST | `/order` | sim | não | `createOrderSchema` | `CreateOrderController` → `CreateOrderService` |
| GET | `/order` | sim | não | — | `ListOrdersController` → `ListOrdersService` |
| POST | `/order/add` | **não** (código atual) | não | `addItemOrderSchema` | `AddItemOrderController` → `AddItemOrderService` |
| DELETE | `/order/remove` | sim | não | `removeItemOrderSchema` | `RemoveItemOrderController` → `RemoveItemOrderService` |
| GET | `/order/detail` | sim | não | `detailOrderSchema` | `DetailOrderController` → `DetailOrderService` |
| PUT | `/order/send` | sim | não | `sendOrderSchema` | `SendOrderController` → `SendOrderService` |
| PUT | `/order/finish` | sim | não | `finishOrderSchema` | `FinishOrderController` → `FinishOrderService` |
| DELETE | `/order/delete` | sim | não | `deleteOrderSchema` | `DeleteOrderController` → `DeleteOrderService` |

Todas as rotas autenticadas usam `Authorization: Bearer <token>`. `POST /order/add` no `routes.ts` atual **não** passa por `IsAuthenticated`.

---

### POST /users

Cria usuário.

**Middlewares**: `validateSchema(createUserSchema)`

**Controller / Service**: `CreateUserController` → `CreateUserService`

**Body** (JSON)

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

- Senha com `bcryptjs` hash, salt **4**
- Role padrão `STAFF`
- Senha não é retornada
- Email duplicado → `400` `{ error: "User already exists" }`

---

### POST /session

Login. **Não usa token**; gera o token.

**Middlewares**: `validateSchema(authUserSchema)`

**Controller / Service**: `AuthUserController` → `AuthUserService`

**Body** (JSON)

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- Assinado com `JWT_TOKEN`
- `sub` = id do usuário
- `expiresIn`: `"30d"` (fixo no código)
- Usuário inexistente → `400` `{ error: "User nao encontrado com esse email" }`
- Senha errada → `400` `{ error: "Email ou senha incorretos" }`

---

### GET /me

Perfil do usuário autenticado. O id vem do token (`request.user_id`), não do body.

**Middlewares**: `IsAuthenticated`

**Controller / Service**: `DetailUserController` → `DetailUserService`

**Headers**

```
Authorization: Bearer <token>
```

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

Token ausente ou inválido → `401`.

---

### GET /category

Lista todas as categorias, ordenadas por `name` crescente.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`

**Controller / Service**: `ListCategoryController` → `ListCategoryService`

**Headers**

```
Authorization: Bearer <token>
```

**Sucesso (200)**

```json
[
  {
    "id": "uuid",
    "name": "Pizzas Doces",
    "createdAt": "2026-09-14T10:30:00.000Z"
  }
]
```

Select: `id`, `name`, `createdAt`.

---

### GET /category/product

Lista os produtos ativos (`disabled = false`) de uma categoria.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(listCategoryProductSchema)`

**Controller / Service**: `ListByCategoryController` → `ListByCategoryService`

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Tipo | Padrão |
| --- | --- | --- |
| category_id | string (UUID) | obrigatório |

Exemplo: `GET /category/product?category_id=uuid-da-categoria`

No Prisma o filtro usa `category_Id`. Categoria inexistente → `400` `{ error: "Categoria não encontrada" }`. Sem `category_id` → `400` de validação.

**Sucesso (200)**

```json
[
  {
    "id": "uuid",
    "name": "Pizza calabresa",
    "price": 4000,
    "description": "Pizza de calabresa tamanho médio",
    "banner": "https://res.cloudinary.com/.../products/....jpg",
    "disabled": false,
    "category_Id": "uuid-da-categoria",
    "createdAt": "2026-09-14T10:30:00.000Z"
  }
]
```

Select igual ao `GET /product`. Produtos desativados não entram nesta listagem.

---

### POST /category

Cria categoria.

**Permissão**: apenas `ADMIN`.

**Middlewares**: `IsAuthenticated`, `IsAdmin`, `validateSchema(createCategorySchema)`

**Controller / Service**: `CreateCategoryController` → `CreateCategoryService`

**Headers**

```
Authorization: Bearer <token>
```

**Body** (JSON)

```json
{
  "name": "Pizzas Doces"
}
```

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "Pizzas Doces",
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

---

### POST /product

Cria produto com imagem.

**Permissão**: apenas `ADMIN`.

**Middlewares** (nessa ordem): `IsAuthenticated`, `IsAdmin`, `upload.single('file')`, `validateSchema(createProductSchema)`

**Controller / Service**: `CreateProductController` → `CreateProductService`

**Headers**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

No Postman: Body → **form-data** (não JSON).

| Key | Tipo | Valor |
| --- | --- | --- |
| name | Text | Pizza calabresa |
| price | Text | 4000 (string; Zod faz coerce para number) |
| description | Text | Pizza de calabresa tamanho médio |
| category_id | Text | UUID de uma categoria existente (`GET /category`) |
| file | File | jpeg/jpg/png, até 5MB |

Aceita também a chave `category_Id`. Sem arquivo → `A imagem do produto é obrigatória`. Sem categoria → `A categoria é obrigatória`. Categoria inexistente → `Categoria não encontrada`.

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "Pizza calabresa",
  "price": 4000,
  "description": "Pizza de calabresa tamanho médio",
  "category_Id": "uuid-da-categoria",
  "banner": "https://res.cloudinary.com/.../products/....jpg",
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

O service:

1. Confere se a categoria existe
2. Envia o buffer ao Cloudinary (`upload_stream` + `end(buffer)`), pasta `products`
3. Grava `banner` com a `secure_url`
4. `prisma.product.create` com `category_Id`

---

### GET /product

Lista produtos filtrando sempre por `disabled`.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(listProductSchema)`

**Controller / Service**: `ListProductController` → `ListProductService`

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Valores | Padrão |
| --- | --- | --- |
| disable | `true` ou `false` | `false` |

Exemplos:

- `GET /product` → produtos com `disabled = false`
- `GET /product?disable=false` → idem
- `GET /product?disable=true` → produtos desativados

A rota do projeto é **`/product`** (singular), igual ao POST.

**Sucesso (200)**

```json
[
  {
    "id": "uuid",
    "name": "Pizza calabresa",
    "price": 4000,
    "description": "Pizza de calabresa tamanho médio",
    "banner": "https://res.cloudinary.com/.../products/....jpg",
    "disabled": false,
    "category_Id": "uuid-da-categoria",
    "createdAt": "2026-09-14T10:30:00.000Z"
  }
]
```

---

### DELETE /product

Desativa ou reativa um produto. **Não apaga** o registro: só atualiza `disabled`.

**Permissão**: apenas `ADMIN`.

**Middlewares**: `IsAuthenticated`, `IsAdmin`, `validateSchema(deleteProductSchema)`

**Controller / Service**: `DeleteProductController` → `DeleteProductService`

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Valores | Padrão |
| --- | --- | --- |
| product_id | UUID do produto | obrigatório |
| disable | `true` ou `false` | `true` |

Exemplos:

- `DELETE /product?product_id=uuid` → `disabled = true` (some da listagem padrão)
- `DELETE /product?product_id=uuid&disable=true` → idem
- `DELETE /product?product_id=uuid&disable=false` → reativa o produto

Produto inexistente → `400` `{ error: "Produto não encontrado" }`.

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "Pizza calabresa",
  "price": 4000,
  "description": "Pizza de calabresa tamanho médio",
  "banner": "https://res.cloudinary.com/.../products/....jpg",
  "disabled": true,
  "category_Id": "uuid-da-categoria",
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

O service:

1. `prisma.product.findUnique` pelo `product_id`
2. Se não existir → `Error("Produto não encontrado")`
3. `prisma.product.update` com `{ disabled }` (nunca `prisma.product.delete`)

---

### POST /order

Abre um pedido (rascunho) para uma mesa, com o nome do cliente.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(createOrderSchema)`

**Controller / Service**: `CreateOrderController` → `CreateOrderService`

**Headers**

```
Authorization: Bearer <token>
```

**Body** (JSON)

```json
{
  "table": 4,
  "name": "João Silva"
}
```

`table` é o número da mesa (inteiro ≥ 1). `name` é o nome do cliente. `user_Id` sai do token.

O pedido nasce com `draft: true` e `status: false` (ainda não enviado à cozinha).

**Sucesso (200)**

```json
{
  "id": "uuid",
  "table": 4,
  "name": "João Silva",
  "status": false,
  "draft": true,
  "user_Id": "uuid-do-usuario",
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

---

### GET /order

Lista pedidos filtrando por `draft`. Sem query, lista pedidos **já enviados** (`draft = false`).

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`

**Controller / Service**: `ListOrdersController` → `ListOrdersService` (arquivos `LIstOrdersController.ts` / `LIstOrdersService.ts`)

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Valores | Padrão |
| --- | --- | --- |
| draft | qualquer string | omitido = `false` |

- `GET /order` → `draft = false` (enviados à cozinha)
- `GET /order?draft=true` → rascunhos
- `GET /order?draft=false` ou outro valor → `draft = false`

Não há schema Zod. Inclui `items` com `product`.

**Sucesso (200)**

```json
[
  {
    "id": "uuid",
    "table": 4,
    "name": "João Silva",
    "status": false,
    "draft": false,
    "createdAt": "2026-09-14T10:30:00.000Z",
    "items": [
      {
        "id": "uuid",
        "amount": 2,
        "product": {
          "id": "uuid",
          "name": "Pizza calabresa",
          "description": "Pizza de calabresa tamanho médio",
          "price": 4000,
          "banner": "https://res.cloudinary.com/.../products/....jpg"
        }
      }
    ]
  }
]
```

---

### POST /order/add

Adiciona um item a um pedido existente.

**Permissão**: no código atual **não** exige token (`routes.ts` não encadeia `IsAuthenticated`). **Não** usa `IsAdmin`.

**Middlewares**: `validateSchema(addItemOrderSchema)`

**Controller / Service**: `AddItemOrderController` → `AddItemOrderService`

**Body** (JSON)

```json
{
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "amount": 2
}
```

Pedido inexistente → `400` `{ error: "Pedido não encontrado" }`.  
Produto inexistente → `400` `{ error: "Produto não encontrado" }`.  
Produto com `disabled = true` → `400` `{ error: "Produto desativado" }`.

**Sucesso (200)**

```json
{
  "id": "uuid",
  "name": "Pizza calabresa",
  "amount": 2,
  "order_Id": "uuid-do-pedido",
  "product_Id": "uuid-do-produto",
  "createdAt": "2026-09-14T10:30:00.000Z",
  "product": {
    "id": "uuid-do-produto",
    "name": "Pizza calabresa",
    "price": 4000,
    "description": "Pizza de calabresa tamanho médio",
    "banner": "https://res.cloudinary.com/.../products/....jpg"
  }
}
```

O service:

1. `prisma.order.findUnique` pelo `order_id`
2. `prisma.product.findUnique` pelo `product_id`
3. `prisma.item.create` com `name` do produto, `amount`, `order_Id`, `product_Id`

---

### DELETE /order/remove

Remove um item da tabela `items`. **Apaga** o registro (não é soft delete).

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(removeItemOrderSchema)`

**Controller / Service**: `RemoveItemOrderController` → `RemoveItemOrderService`

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Tipo | Padrão |
| --- | --- | --- |
| item_id | string (UUID) | obrigatório |

Exemplo: `DELETE /order/remove?item_id=uuid-do-item`

Item inexistente → `400` `{ error: "Item não encontrado" }`.

**Sucesso (200)**

```json
{
  "message": "Item removido com sucesso",
  "item": {
    "id": "uuid",
    "name": "Pizza calabresa",
    "amount": 2,
    "order_Id": "uuid-do-pedido",
    "product_Id": "uuid-do-produto",
    "createdAt": "2026-09-14T10:30:00.000Z"
  }
}
```

O service:

1. `prisma.item.findUnique` pelo `item_id`
2. Se não existir → `Error("Item não encontrado")`
3. `prisma.item.delete` pelo `item_id`

---

### GET /order/detail

Retorna os detalhes de um pedido: mesa, cliente, status, itens e produtos.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(detailOrderSchema)`

**Controller / Service**: `DetailOrderController` → `DetailOrderService`

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Tipo | Padrão |
| --- | --- | --- |
| order_id | string (UUID) | obrigatório |

Exemplo: `GET /order/detail?order_id=uuid-do-pedido`

Pedido inexistente → `400` `{ error: "Pedido não encontrado" }`. Sem `order_id` → `400` de validação.

**Sucesso (200)**

```json
{
  "id": "uuid",
  "table": 4,
  "name": "João Silva",
  "status": false,
  "draft": true,
  "user_Id": "uuid-do-usuario",
  "createdAt": "2026-09-14T10:30:00.000Z",
  "updatedAt": "2026-09-14T10:35:00.000Z",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Maria Garçom",
    "email": "maria@example.com",
    "role": "STAFF"
  },
  "items": [
    {
      "id": "uuid",
      "name": "Pizza calabresa",
      "amount": 2,
      "product_Id": "uuid-do-produto",
      "createdAt": "2026-09-14T10:32:00.000Z",
      "product": {
        "id": "uuid-do-produto",
        "name": "Pizza calabresa",
        "description": "Pizza de calabresa tamanho médio",
        "price": 4000,
        "banner": "https://res.cloudinary.com/.../products/....jpg"
      }
    }
  ]
}
```

O service:

1. `prisma.order.findUnique` pelo `order_id` com `items` e `product`
2. Se não existir → `Error("Pedido não encontrado")`

---

### PUT /order/send

Envia o pedido à cozinha: `draft` passa a `false`.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(sendOrderSchema)`

**Controller / Service**: `SendOrderController` → `SendOrderService`

**Headers**

```
Authorization: Bearer <token>
```

**Body** (JSON)

```json
{
  "order_id": "uuid-do-pedido",
  "name": "João Silva"
}
```

`order_id` é obrigatório no Zod. `name` é lido no controller e gravado no pedido, mas **não** está no schema.

Pedido inexistente → `400` `{ error: "Falha ao enviar pedido" }`.

**Sucesso (200)**

```json
{
  "id": "uuid",
  "table": 4,
  "name": "João Silva",
  "status": false,
  "draft": false,
  "createdAt": "2026-09-14T10:30:00.000Z"
}
```

O service:

1. `prisma.order.findFirst` pelo `order_id`
2. `prisma.order.update` com `{ draft: false, name }`

---

### PUT /order/finish

Finaliza o pedido: `status` passa a `true`.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(finishOrderSchema)`

**Controller / Service**: `FinishOrderController` → `FinishOrderService`

**Headers**

```
Authorization: Bearer <token>
```

**Body** (JSON)

```json
{
  "order_id": "uuid-do-pedido"
}
```

Pedido inexistente → `400` `{ error: "Falha ao finalizar o pedido" }`.

**Sucesso (200)**

```json
{
  "message": "Pedido finalizado com sucesso",
  "order": {
    "id": "uuid",
    "table": 4,
    "name": "João Silva",
    "status": true,
    "draft": true,
    "createdAt": "2026-09-14T10:30:00.000Z"
  }
}
```

O service:

1. `prisma.order.findFirst` pelo `order_id`
2. `prisma.order.update` com `{ status: true }`

---

### DELETE /order/delete

Apaga o pedido. Os itens relacionados saem no cascade.

**Permissão**: usuário **logado** (STAFF ou ADMIN). **Não** usa `IsAdmin`.

**Middlewares**: `IsAuthenticated`, `validateSchema(deleteOrderSchema)`

**Controller / Service**: `DeleteOrderController` → `DeleteOrderService`

**Headers**

```
Authorization: Bearer <token>
```

**Query**

| Param | Tipo | Padrão |
| --- | --- | --- |
| order_id | string (UUID) | obrigatório |

Exemplo: `DELETE /order/delete?order_id=uuid-do-pedido`

**Sucesso (200)**

```json
{
  "message": "Pedido deletado com sucesso",
  "order": {
    "id": "uuid",
    "table": 4,
    "name": "João Silva",
    "status": false,
    "draft": true,
    "createdAt": "2026-09-14T10:30:00.000Z"
  }
}
```

Pedido inexistente → `400` `{ "message": "Pedido não encontrado" }`.  
Falha no delete → `400` `{ "message": "Erro ao deletar o pedido" }`.

O service:

1. `prisma.order.findUnique` pelo `order_id`
2. Se não existir → `Error("Pedido não encontrado")`
3. `prisma.order.delete` (cascade nos items)

---

## Fluxo de Requisição

### Criação de usuário

```
1. POST /users
   ↓
2. validateSchema(createUserSchema)
   ↓
3. CreateUserController → CreateUserService
   - email já existe → Error("User already exists")
   - hash da senha (salt 4)
   - prisma.user.create (sem retornar password)
   ↓
4. res.json(user)  → 200
```

### Login

```
1. POST /session
   ↓
2. validateSchema(authUserSchema)
   ↓
3. AuthUserController → AuthUserService
   - email existe?
   - senha confere?
   - JWT (sub = id, expiresIn 30d)
   ↓
4. res.json({ id, name, email, token })  → 200
```

### Perfil (logado)

```
1. GET /me
   ↓
2. IsAuthenticated
   ↓
3. DetailUserController → DetailUserService
   - prisma.user.findFirst pelo request.user_id
   ↓
4. res.json(user)  → 200
```

### Listar categorias (logado)

```
1. GET /category
   ↓
2. IsAuthenticated
   ↓
3. ListCategoryController → ListCategoryService
   - prisma.category.findMany (orderBy name asc)
   ↓
4. res.json(categories)  → 200
```

### Listar produtos de uma categoria (logado)

```
1. GET /category/product?category_id=uuid
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(listCategoryProductSchema)
   ↓
4. ListByCategoryController → ListByCategoryService
   - categoria existe?
   - prisma.product.findMany({ where: { category_Id, disabled: false } })
   ↓
5. res.json(products)  → 200
```

### Criar categoria (admin)

```
1. POST /category
   ↓
2. IsAuthenticated
   ↓
3. IsAdmin  → role === "ADMIN"
   ↓
4. validateSchema(createCategorySchema)
   ↓
5. CreateCategoryController → CreateCategoryService
   ↓
6. res.json(category)  → 200
```

### Criar produto (admin + imagem)

```
1. POST /product  (multipart/form-data)
   ↓
2. IsAuthenticated
   ↓
3. IsAdmin
   ↓
4. upload.single('file')  → request.file.buffer
   ↓
5. validateSchema(createProductSchema)  → coerce do price
   ↓
6. CreateProductController
   - exige request.file e category_id / category_Id
   ↓
7. CreateProductService
   - categoria existe?
   - Cloudinary upload → banner URL
   - prisma.product.create ({ category_Id, banner, ... })
   ↓
8. res.json(product)  → 200
```

### Listar produtos (logado)

```
1. GET /product  ou  GET /product?disable=true|false
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(listProductSchema)
   - disable omitido → false
   ↓
4. ListProductController → ListProductService
   - prisma.product.findMany({ where: { disabled } })
   ↓
5. res.json(products)  → 200
```

### Desativar / reativar produto (admin)

```
1. DELETE /product?product_id=uuid  ou  DELETE /product?product_id=uuid&disable=true|false
   ↓
2. IsAuthenticated
   ↓
3. IsAdmin  → role === "ADMIN"
   ↓
4. validateSchema(deleteProductSchema)
   - product_id obrigatório
   - disable omitido → true
   ↓
5. DeleteProductController → DeleteProductService
   - produto existe?
   - prisma.product.update({ disabled })  (não apaga a linha)
   ↓
6. res.json(product)  → 200
```

### Criar pedido (logado)

```
1. POST /order
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(createOrderSchema)
   - table inteiro ≥ 1
   - name string obrigatório
   ↓
4. CreateOrderController → CreateOrderService
   - user_id do JWT
   - prisma.order.create ({ table, name, user_Id })
   - draft true, status false (defaults do schema)
   ↓
5. res.json(order)  → 200
```

### Listar pedidos (logado)

```
1. GET /order  ou  GET /order?draft=true
   ↓
2. IsAuthenticated
   ↓
3. ListOrdersController → ListOrdersService
   - draft query === "true" → rascunhos; senão draft false
   - prisma.order.findMany (items + product)
   ↓
4. res.json(orders)  → 200
```

### Adicionar item ao pedido (logado)

```
1. POST /order/add
   ↓
2. validateSchema(addItemOrderSchema)
   (IsAuthenticated não está nesta rota no código atual)
   ↓
3. AddItemOrderController → AddItemOrderService
   - pedido existe?
   - produto existe e não está disabled?
   - prisma.item.create ({ name, amount, order_Id, product_Id })
   ↓
4. res.json(item)  → 200
```

### Remover item do pedido (logado)

```
1. DELETE /order/remove?item_id=uuid
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(removeItemOrderSchema)
   ↓
4. RemoveItemOrderController → RemoveItemOrderService
   - item existe?
   - prisma.item.delete ({ where: { id: item_id } })
   ↓
5. res.json({ message, item })  → 200
```

### Detalhar pedido (logado)

```
1. GET /order/detail?order_id=uuid
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(detailOrderSchema)
   ↓
4. DetailOrderController → DetailOrderService
   - prisma.order.findUnique (items + product + user)
   - pedido existe?
   ↓
5. res.json(order)  → 200
```

### Enviar pedido à cozinha (logado)

```
1. PUT /order/send
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(sendOrderSchema)
   ↓
4. SendOrderController → SendOrderService
   - pedido existe?
   - prisma.order.update ({ draft: false, name })
   ↓
5. res.json(order)  → 200
```

### Finalizar pedido (logado)

```
1. PUT /order/finish
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(finishOrderSchema)
   ↓
4. FinishOrderController → FinishOrderService
   - pedido existe?
   - prisma.order.update ({ status: true })
   ↓
5. res.json({ message: "Pedido finalizado com sucesso", order })  → 200
```

### Deletar pedido (logado)

```
1. DELETE /order/delete?order_id=uuid
   ↓
2. IsAuthenticated
   ↓
3. validateSchema(deleteOrderSchema)
   ↓
4. DeleteOrderController → DeleteOrderService
   - pedido existe?
   - prisma.order.delete
   ↓
5. 200 { message: "Pedido deletado com sucesso", order }
   ou 400 { message: "Pedido não encontrado" | "Erro ao deletar o pedido" }
```

---

## Configurações do Projeto

### TypeScript (`tsconfig.json`)

- **target**: ES2020
- **module / moduleResolution**: `nodenext`
- **strict**: true
- **outDir**: `./dist`
- **rootDir**: `./src`
- **sourceMap**: true
- `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noUncheckedIndexedAccess`

O `package.json` tem `"type": "commonjs"`. O generator do Prisma usa `moduleFormat = "cjs"`.

### Prisma (`prisma/schema.prisma` + `prisma7.config.ts`)

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}
```

A URL **não** fica no schema. O CLI lê `prisma7.config.ts`. Runtime em `src/prisma/prisma.ts` com `PrismaPg`.

### Express (`src/server.ts`)

1. `express.json()`
2. `cors()`
3. `router`
4. Error handler com **4 parâmetros** (`error`, `request`, `response`, `next`)

- `Error` → `400` `{ error: error.message }`
- demais → `500` `{ error: "Internal server error" }`

Porta: `process.env.PORT` ou `3333`.

### Cloudinary (`src/config/cloudinary.ts`)

Nomes oficiais da lib (não `cloudinary_name`):

```ts
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});
```

### Variáveis de ambiente (`.env`)

```bash
PORT=3333
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_TOKEN="chave-secreta-do-jwt"
CLOUDINARY_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_SECRET="seu-api-secret"
```

Obrigatórias:

- `DATABASE_URL`
- `JWT_TOKEN` (não é `JWT_SECRET`)
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET` (para `POST /product`)

Não há `.env.example` na raiz do projeto. Sem as chaves do Cloudinary, o módulo lança `Variáveis do Cloudinary não configuradas`. Credencial inválida no upload costuma voltar **403**.

### Scripts NPM

```json
{
  "dev": "tsx watch src/server.ts",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev"
}
```

Alteração no `.env` exige reiniciar o `npm run dev`.

---

## Segurança

- JWT no header `Authorization: Bearer <token>`
- Payload com `sub` = id do usuário; assinatura com `JWT_TOKEN`
- Roles `STAFF` e `ADMIN`
  - Público: `POST /users`, `POST /session`
  - Logado: `GET /me`, `GET /category`, `GET /category/product`, `GET /product`, `POST /order`, `GET /order`, `DELETE /order/remove`, `GET /order/detail`, `PUT /order/send`, `PUT /order/finish`, `DELETE /order/delete`
  - Admin: `POST /category`, `POST /product`, `DELETE /product`
  - Sem `IsAuthenticated` no `routes.ts` atual: `POST /order/add`
- Senhas com bcryptjs (salt 4); senha nunca retorna na API
- Zod valida inputs; Multer restringe tipo e tamanho da imagem

---

## Observações

1. Preço de produto é `Float`. No form-data chega string; use `z.coerce.number()`.
2. IDs são UUID gerados pelo Prisma.
3. `createdAt` / `updatedAt` são automáticos.
4. No Prisma use `category_Id` / `order_Id` / `product_Id`; no JSON use `category_id` / `order_id` / `product_id`.
5. `where: { id: undefined }` no Prisma ignora o filtro — sempre validar `category_id` antes do `findFirst`.
6. Prisma 7 exige adapter (`PrismaPg`).
7. `src/generated/prisma` está no `.gitignore`.
8. Error handler global captura `throw new Error(...)` (Express 5).
9. O `.refine` do Zod fica **depois** de `z.object({...})`, não como campo `message`/`path` dentro do objeto.
10. Ciclo do pedido: criar (`draft true`, `status false`) → adicionar itens → `PUT /order/send` (`draft false`) → `PUT /order/finish` (`status true`). `DELETE /order/delete` apaga o pedido e os items (cascade).
11. Arquivos de listagem de pedidos: `LIstOrdersController.ts` e `LIstOrdersService.ts` (L maiúsculo + I).

---

## Como iniciar

1. `npm install`
2. Configurar `.env` (`DATABASE_URL`, `JWT_TOKEN`, `PORT`, Cloudinary)
3. `npx prisma generate`
4. `npx prisma migrate dev` (se o banco ainda não tiver as tabelas)
5. `npm run dev`
6. API em `http://localhost:3333`

---

**Atualizado em**: 14/09/2026  
**Versão do projeto**: 1.0.0
