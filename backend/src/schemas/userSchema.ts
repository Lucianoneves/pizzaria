 import { z } from 'zod';

 export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(4,{message: "Nome é obrigatório"}),
        email: z.string().email({message: "Email é obrigatório"}),
        password: z.string().min(4,{message: "Senha é obrigatória"}),
    }),
 });
  

 export const authUserSchema = z.object({
    body: z.object({
        email: z.string().email({message: "Email é obrigatório"}),
        password: z.string().min(4,{message: "Senha é obrigatória"}),
    }),
 });
 