import { Request, Response, NextFunction } from 'express'; 
import prisma from '../prisma/prisma';

 
 export const IsAdmin = async  (request: Request, response: Response, next: NextFunction): Promise<void> => {
    
        const user_id = request.user_id;


        if(!user_id) {
             response.status(401).json
            ({ error: 'Usuario sem permissão', 

            });
            return
        }

       const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
       });

       if(!user || user.role !== 'ADMIN') { 
        response.status(401).json
        ({ error: 'Usuario sem permissão', 

        });
        return
    }


     // Usuario e admin, pode continuar
     next();

       
    }


