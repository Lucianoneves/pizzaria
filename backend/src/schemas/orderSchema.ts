import { z } from 'zod';


export const createOrderSchema = z.object({
    body: z.object({
        table: z.coerce.number().int().min(1, { message: 'O número da mesa é obrigatório' }),
        name: z.string().min(1, { message: 'O nome do cliente é obrigatório' }),
    }),
});

export const addItemOrderSchema = z.object({
    body: z.object({
        order_id: z.string().min(1, { message: 'O id do pedido é obrigatório' }),
        product_id: z.string().min(1, { message: 'O id do produto é obrigatório' }),
        amount: z.coerce.number().int().min(1, { message: 'A quantidade é obrigatória' }),
    }),
});

export const removeItemOrderSchema = z.object({
    query: z.object({
        item_id: z.string().min(1, { message: 'O id do item é obrigatório' }),
    }),
});

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z.string().min(1, { message: 'O id do pedido é obrigatório' }),
    }),
});


    export const sendOrderSchema = z.object({
        body: z.object({
            order_id: z.string().min(1, { message: 'O id do pedido é obrigatório' }),
        })
    })


    export const finishOrderSchema = z.object({
        body: z.object({
            order_id: z.string().min(1, { message: 'O id do pedido é obrigatório' }),
        })
    })

export const deleteOrderSchema = z.object({
    query: z.object({
        order_id: z.string().min(1, { message: 'O id do pedido é obrigatório' }),
    }),
});

