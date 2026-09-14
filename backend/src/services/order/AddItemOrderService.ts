import prisma from '../../prisma/prisma';

interface AddItemOrderServiceProps {
    order_id: string;
    product_id: string;
    amount: number;
}

class AddItemOrderService {
    async execute({ order_id, product_id, amount }: AddItemOrderServiceProps) {
        const orderExists = await prisma.order.findUnique({
            where: {
                id: order_id,
            },
        });

        if (!orderExists) {
            throw new Error('Pedido não encontrado');
        }

        const productExists = await prisma.product.findUnique({
            where: {
                id: product_id,
                disabled: false,
            },
        });

        if (!productExists) {
            throw new Error('Produto não encontrado');
        }

        if (productExists.disabled) {
            throw new Error('Produto desativado');
        }

        const item = await prisma.item.create({
            data: {
                name: productExists.name,
                amount,
                order_Id: order_id,
                product_Id: product_id,
            },
            select: {
                id: true,
                name: true,
                amount: true,
                order_Id: true,
                product_Id: true,
                createdAt: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        banner: true,
                    },
                },
            },
        });

        return item;
    }
}

export { AddItemOrderService };
