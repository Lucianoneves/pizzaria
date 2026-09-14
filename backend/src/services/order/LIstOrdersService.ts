import prisma from "../../prisma/prisma";


 interface ListOrdersServiceProps {
    draft?: string;
 }


 class ListOrdersService { 
    async execute({ draft }: ListOrdersServiceProps) { 

        try {
            const orders = await prisma.order.findMany({
                where: {
                    draft: draft === "true" ? true : false,
                    
                },
                select: {
                    id: true,
                    table: true,
                    name: true,
                    status: true,
                    draft: true,
                    createdAt: true,
                    items: {
                        select: {
                            id: true,                            
                            amount: true,
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
                    },
                    
                },
            });

            return orders;
        }
        catch (error) {
            throw new Error('Erro ao listar pedidos');
        }

 }

}

export default ListOrdersService;