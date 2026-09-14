import  prisma from '../../prisma/prisma';
import { hash } from 'bcryptjs';

interface CreateUserProps { //interface para as propriedades do usuario
    name: string;
    email: string;
    password: string;
}


class CreateUserService {
    async execute({ name, email, password }: CreateUserProps) {

        const userAlreadyExists = await prisma.user.findFirst({ 
            where: {
                email: email
            }
        });

        if(userAlreadyExists) {
            throw new Error('User already exists');
        }


        const passwordHash =await hash(password, 4);   
        
        const user = await prisma.user.create({ //criando o usuario no banco de dados
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
               
            }
        });

        return user; //retornando o nome do usuario criado

        console.log(name, email, password);

        return "usuario Luciano "
    }

}


export { CreateUserService };