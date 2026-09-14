import prisma from '../../prisma/prisma';

interface DeleteOrderServiceProps {
    order_id: string;
}

class DeleteOrderService {
    async execute({ order_id }: DeleteOrderServiceProps) {
        const orderExists = await prisma.order.findUnique({
            where: {
                id: order_id,
            },
        });

        if (!orderExists) {
            throw new Error('Pedido não encontrado');
        }

        try {
            const order = await prisma.order.delete({
                where: {
                    id: order_id,
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    createdAt: true,
                },
            });

            return order;
        } catch {
            throw new Error('Erro ao deletar o pedido');
        }
    }
}

export { DeleteOrderService };
