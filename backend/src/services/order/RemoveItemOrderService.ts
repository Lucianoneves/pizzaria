import prisma from '../../prisma/prisma';

interface RemoveItemOrderServiceProps {
    item_id: string;
}

class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemOrderServiceProps) {
        const itemExists = await prisma.item.findUnique({
            where: {
                id: item_id,
            },
        });

        if (!itemExists) {
            throw new Error('Item não encontrado');
        }

        const item = await prisma.item.delete({
            where: {
                id: item_id,
            },
            select: {
                id: true,
                name: true,
                amount: true,
                order_Id: true,
                product_Id: true,
                createdAt: true,
            },
        });

        return item;
    }
}

export { RemoveItemOrderService };
