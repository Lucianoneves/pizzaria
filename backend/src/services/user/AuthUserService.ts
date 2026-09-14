
import { compare } from 'bcryptjs';
import prisma from '../../prisma/prisma';
import { sign } from 'jsonwebtoken';

interface AuthUserProps {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email,password}: AuthUserProps) {
       const user = await prisma.user.findFirst({
        where: {
            email: email
        }
       });


       if(!user) {
        throw new Error('User nao encontrado com esse email');
       }
       const passwordMatch = await compare(password, user.password);

       if (!passwordMatch) {
        throw new Error('Email ou senha incorretos');
       }

       const token = sign({
      name: user.name,
      email: user.email
       },
    process.env.JWT_TOKEN as string, {
        subject: user.id,
        expiresIn: '30d'
       });

       return{
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
       }    

    } 
}

export { AuthUserService };