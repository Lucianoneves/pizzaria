import { Request, Response } from 'express';
import { AddItemOrderService } from '../../services/order/AddItemOrderService';

class AddItemOrderController {
    async handle(request: Request, response: Response) {
        const { order_id, product_id, amount } = request.body;

        const addItemOrderService = new AddItemOrderService();
        const item = await addItemOrderService.execute({
            order_id,
            product_id,
            amount: Number(amount),
        });

        return response.json(item);
    }
}

export { AddItemOrderController };
