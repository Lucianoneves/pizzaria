import prisma from '../../prisma/prisma';

interface ListByCategoryServiceProps {
    category_id: string;
}

class ListByCategoryService {
    async execute({ category_id }: ListByCategoryServiceProps) {
        if (!category_id) {
            throw new Error('A categoria é obrigatória');
        }

        const categoryExists = await prisma.category.findFirst({
            where: {
                id: category_id,
            },
        });

        if (!categoryExists) {
            throw new Error('Categoria não encontrada');
        }

        const products = await prisma.product.findMany({
            where: {
                category_Id: category_id,
                disabled: false,
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
    }
}

export { ListByCategoryService };
