import prisma from '../../prisma/prisma';


interface FinishOrderServiceProps {

    order_id: string;

}

class FinishOrderService {
    async execute({ order_id }: FinishOrderServiceProps) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    id: order_id
                },
            });

            if (!order) {
                throw new Error('Falha ao finalizar pedido');
            }

            const updateOrder = await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: true,

                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    createdAt: true,
                }

            });

            return updateOrder;

        } catch (error) {
            throw new Error('Falha ao finalizar o pedido');
        }
    }
}

export { FinishOrderService };