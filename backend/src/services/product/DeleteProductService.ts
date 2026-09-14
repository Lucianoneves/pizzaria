import prisma from '../../prisma/prisma';

interface DeleteProductServiceProps {
    product_id: string;
    disabled: boolean;
}

class DeleteProductService {
    async execute({ product_id, disabled }: DeleteProductServiceProps) {
        const productExists = await prisma.product.findUnique({
            where: {
                id: product_id,
            },
        });

        if (!productExists) {
            throw new Error('Produto não encontrado');
        }

        const product = await prisma.product.update({
            where: {
                id: product_id,
            },
            data: {
                disabled,
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
                disabled: true,
                category_Id: true,
                createdAt: true,
            },
        });

        return product;
    }
}

export { DeleteProductService };
