import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
}

export function IsAuthenticated(request: Request, response: Response, next: NextFunction) { // Middleware para verificar se o usuário está autenticado
    const authToken = request.headers.authorization;

    if (!authToken) { // Verifica se o token está presente
        return response.status(401).json({
            error: 'Token não fornecido',
        });
    }

    const [, token] = authToken.split(' ');

    if (!token) {
        return response.status(401).json({
            error: 'Token inválido',
        });
    }

    try { // Verifica se o token é válido
        const { sub } = verify(token, process.env.JWT_TOKEN as string) as Payload;

        request.user_id = sub;

        return next();
    } catch {
        return response.status(401).json({
            error: 'Token inválido',
        });

        
    }
}
