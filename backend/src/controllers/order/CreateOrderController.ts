import { Request, Response } from 'express';
import { CreateOrderService } from '../../services/order/CreateOrderService';

class CreateOrderController {
    async handle(request: Request, response: Response) {
        const { table, name } = request.body;
        const user_id = request.user_id;

        const createOrderService = new CreateOrderService();
        const order = await createOrderService.execute({
            table: Number(table),
            name,
            user_id,
        });

        return response.json(order);
    }
}

export { CreateOrderController };
