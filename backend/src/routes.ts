import { Router } from 'express';
import upload from './config/multer';
import { CreateUserController } from './controllers/user/CreateUserController';
import { authUserSchema, createUserSchema } from './schemas/userSchema';
import { validateSchema } from './middlewares/validateSchema';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { IsAuthenticated } from './middlewares/isAuthenticated';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { ListCategoryController } from './controllers/category/ListCategoryController';
import { IsAdmin } from './middlewares/isAdmin';
import { createCategorySchema, listCategoryProductSchema } from './schemas/categorySchema';
import { CreateProductController } from './controllers/product/CreateProductController';
import { ListProductController } from './controllers/product/ListProductController';
import { DeleteProductController } from './controllers/product/DeleteProductController';
import { ListByCategoryController } from './controllers/product/ListByCategoryController';
import { createProductSchema, listProductSchema, deleteProductSchema } from './schemas/productSchema';
import { CreateOrderController } from './controllers/order/CreateOrderController';
import { ListOrdersController } from './controllers/order/LIstOrdersController';
import { AddItemOrderController } from './controllers/order/AddItemOrderController';
import { RemoveItemOrderController } from './controllers/order/RemoveItemOrderController';
import { DetailOrderController } from './controllers/order/DetailOrderController';
import { SendOrderController } from './controllers/order/SendOrderController';
import { FinishOrderController } from './controllers/order/FinishOrderController';
import { DeleteOrderController } from './controllers/order/DeleteOrderController';
import {
  createOrderSchema,
  addItemOrderSchema,
  removeItemOrderSchema,
  detailOrderSchema,
  sendOrderSchema,
  finishOrderSchema,
  deleteOrderSchema,
} from './schemas/orderSchema';


const router = Router();




router.post('/users',  // Rota para criar um usuario
  validateSchema(createUserSchema),
  new CreateUserController().handle
);

router.post('/session',  // Rota para logar um usuario
  validateSchema(authUserSchema),
  new AuthUserController().handle
);

router.get('/me', IsAuthenticated, new DetailUserController().handle); // Rota para detalhar um usuario  


// Rotas para  Listar categorias
router.get(
  '/category',
  IsAuthenticated,
  new ListCategoryController().handle
);



// Listar produtos de uma categoria
router.get(
  '/category/product',
  IsAuthenticated,
  validateSchema(listCategoryProductSchema),
  new ListByCategoryController().handle
);




router.post( // Rota para criar uma categoria
  '/category',
  IsAuthenticated,
  IsAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle
);



router.post( // Rota para criar um produto
  '/product',
  IsAuthenticated,
  IsAdmin,
  upload.single('file'),
  validateSchema(createProductSchema),
  new CreateProductController().handle
);



// Listar de produtos
router.get(
  '/product',
  IsAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle
);

// Desativar / reativar produto (soft delete via disabled)
router.delete(
  '/product',
  IsAuthenticated,
  IsAdmin,
  validateSchema(deleteProductSchema),
  new DeleteProductController().handle
);



// Criar pedido (mesa + nome do cliente)
router.post(
  '/order',
  IsAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle
);

// Listar orders (pedidos)
router.get(
  '/order',
  IsAuthenticated,
  new ListOrdersController().handle
);

// Adicionar item ao pedido
router.post(
  '/order/add',
  validateSchema(addItemOrderSchema),
  new AddItemOrderController().handle
);

// Remover item do pedido
router.delete(
  '/order/remove',
  IsAuthenticated,
  validateSchema(removeItemOrderSchema),
  new RemoveItemOrderController().handle
);

// Detalhes de um pedido
router.get(
  '/order/detail',
  IsAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle
);


// Enviar pedido
router.put(
  '/order/send',
  IsAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle
);


// Finalizar pedido
router.put(
  '/order/finish',
  IsAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle
);

// Deletar pedido
router.delete(
  '/order/delete',
  IsAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle
);

export { router };  