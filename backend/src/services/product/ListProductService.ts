import prisma from '../../prisma/prisma';

interface ListProductServiceProps {
    disabled?: boolean;
}

class ListProductService {
    async execute({ disabled }: ListProductServiceProps) {

        try {
        const products = await prisma.product.findMany({
            where: {
                disabled: disabled ? disabled : false,
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
            orderBy: {
                name: 'asc',
            },
            });

            return products;
        } catch (error) {
            throw new Error('Erro ao listar produtos');
        }
    }
}

export { ListProductService };
