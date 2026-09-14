import { Request, Response } from 'express'; 
import { AuthUserService } from '../../services/user/AuthUserService';


class AuthUserController { 
    async handle(request: Request, response: Response) { // Controller para autenticar um usuário
        const { email, password } = request.body; 
 

         const user_id = request.user_id; // Obtém o ID do usuário autenticado

        const authUserService = new AuthUserService();
        const session = await authUserService.execute({ email, password });

        response.json(session);

    }
}

export { AuthUserController };