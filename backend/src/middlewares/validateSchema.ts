import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

export const validateSchema = 
(schema: ZodType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query, 
        });
      return   next(); 

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json(
                 {error:"Erro de validação",
                 details: error.issues.map((issue)=>({
                    message: issue.message,
                    path: issue.path,
                 })),
                 });
                
        }
        return res.status(500).json({
            error: 'Erro interno do servidor!!! ' });
    }
}

