import { Request, Response } from 'express';
import { DeleteOrderService } from '../../services/order/DeleteOrderService';

class DeleteOrderController {
    async handle(request: Request, response: Response) {
        const order_id = request.query.order_id as string;

        try {
            const deleteOrderService = new DeleteOrderService();
            const order = await deleteOrderService.execute({ order_id });

            return response.json({
                message: 'Pedido deletado com sucesso',
                order,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao deletar o pedido';

            return response.status(400).json({
                message,
            });
        }
    }
}

export { DeleteOrderController };
