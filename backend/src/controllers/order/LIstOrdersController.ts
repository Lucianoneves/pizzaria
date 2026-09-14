

import { Request, Response } from "express"; 
import ListOrdersService from "../../services/order/LIstOrdersService";


class ListOrdersController { 
   async handle(request: Request, response: Response) { 

    const drfat = request.query?.draft as string | undefined;

    const listOrders = new ListOrdersService();

    const orders = await listOrders.execute({ 
        draft: drfat
     });

     response.json(orders);

        
}
}

export { ListOrdersController };