import { Request, Response } from 'express';
import { RemoveItemOrderService } from '../../services/order/RemoveItemOrderService';

class RemoveItemOrderController {
    async handle(request: Request, response: Response) {
        const item_id = request.query.item_id as string;

        const removeItemOrderService = new RemoveItemOrderService();
        const item = await removeItemOrderService.execute({ item_id });

        return response.json({
            message: 'Item removido com sucesso',
            item,
        });
    }
}

export { RemoveItemOrderController };
