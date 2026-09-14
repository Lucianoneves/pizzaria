import prisma from '../../prisma/prisma';

class ListCategoryService {
    async execute() {
        try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return categories;
        } catch (error) {
            throw new Error('Error listing categories');
        }
    }
}

export { ListCategoryService };
