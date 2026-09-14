import  prisma from '../../prisma/prisma';


interface CreateCategoryProps {
    name: string; 
}


    class CreateCategoryService {
        async execute({ name }: CreateCategoryProps) {

            try {
            const category = await prisma.category.create({
                data: {
                    name: name
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                }
            });

            return category;
            } catch (error) {
                throw new Error('Error creating category');
            }
        }
    }

    export { CreateCategoryService };