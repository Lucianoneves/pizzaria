import prisma from '../../prisma/prisma';

interface DetailOrderServiceProps {
    order_id: string;
}

class DetailOrderService {
    async execute({ order_id }: DetailOrderServiceProps) {

        try {
        const order = await prisma.order.findUnique({
            where: {
                id: order_id,
            },
            select: {
                id: true,
                table: true,
                name: true,
                status: true,
                draft: true,
                user_Id: true,
                createdAt: true,
                updatedAt: true,               
                
                items: {
                    select: {
                        id: true,
                        name: true,
                        amount: true,
                        product_Id: true,
                        createdAt: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                price: true,
                                banner: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!order) {
            throw new Error('Ordem  não encontrado');
        } 

        return order;
        } catch (error) {
            throw new Error('Falha ao buscar detalhes da ordem');
        }

    }
}

export { DetailOrderService };
