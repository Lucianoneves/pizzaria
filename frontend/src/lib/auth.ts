

import { cookies } from "next/headers"; 

const COOKIE_NAME = "token-pizzaria";

export async function getToken(): Promise<string | undefined> { // pega o token do cookie
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
} 

export async function setToken(token: string) {  // define o token no cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
}

export async function removeToken() { 
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

}