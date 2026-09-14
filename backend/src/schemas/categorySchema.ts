import { z } from 'zod'; 


export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({message: 'Nome da categoria precisa ser um texto'}).min(2,{message: 'Nome da categoria deve ter pelo menos 2 caracteres'}), 
  }),
});



export const listCategoryProductSchema = z.object({
  query: z.object({
    category_id: z.string().min(1, { message: 'O id da categoria é obrigatório' }),
  }),
});

