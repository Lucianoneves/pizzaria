import prisma from '../../prisma/prisma';


interface SendOrderServiceProps {
    name: string;
    order_id: string;

}

class SendOrderService {
    async execute({ order_id, name }: SendOrderServiceProps) {
        try {
            const order = await prisma.order.findFirst({
                where: {
                    id: order_id
                },
            });

            if (!order) {
                throw new Error('Falha ao enviar pedido');
            }

            const updateOrder = await prisma.order.update({
                where: { id: order.id },
                data: {
                    draft: false,
                    name: name,
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
            throw new Error('Falha ao enviar pedido');
        }
    }
}

export { SendOrderService };