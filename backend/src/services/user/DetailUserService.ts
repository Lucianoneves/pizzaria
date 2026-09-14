import prisma from "../../prisma/prisma";




class DetailUserService {
    async execute(user_id: string) {
       try { 
        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                
            }
        });

        if(!user) {
            throw new Error("User not found");
        }

        return user;
       } catch (error) {
        throw new Error("Error on detail user");
       }
    }
}

export { DetailUserService };