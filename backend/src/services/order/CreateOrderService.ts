import prisma from '../../prisma/prisma';

interface CreateOrderServiceProps {
    table: number;
    name: string;
    user_id: string;
}

class CreateOrderService {
    async execute({ table, name, user_id }: CreateOrderServiceProps) {
        if (!user_id) {
            throw new Error('Usuário não autenticado');
        }

        const order = await prisma.order.create({
            data: {
                table,
                name,
                user_Id: user_id,
            },
            select: {
                id: true,
                table: true,
                name: true,
                status: true,
                draft: true,
                user_Id: true,
                createdAt: true,
            },
        });

        return order;
    }
}

export { CreateOrderService };
