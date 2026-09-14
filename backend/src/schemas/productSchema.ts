import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: 'O nome do produto é obrigatório' }),
        price: z.coerce.number().min(1, { message: 'O preço do produto é obrigatório' }),
        description: z.string().min(1, { message: 'A descrição do produto é obrigatória' }),
        category_id: z.string().min(1, { message: 'A categoria do produto é obrigatória' }).optional(),
        category_Id: z.string().min(1, { message: 'A categoria do produto é obrigatória' }).optional(),
    }).refine((data) => data.category_id || data.category_Id, {
        message: 'A categoria do produto é obrigatória',
        path: ['category_id'],
    }),
});

export const listProductSchema = z.object({
    query: z.object({
        disable: z
            .enum(['true', 'false'])
            .optional()
            .default('false'),
    }),
});

export const deleteProductSchema = z.object({
    query: z.object({
        product_id: z.string().min(1, { message: 'O id do produto é obrigatório' }),
        disable: z
            .enum(['true', 'false'])
            .optional()
            .default('true'),
    }),
});
