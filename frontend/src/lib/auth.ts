
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiClient } from "./api";
import { type User } from "./types";

const COOKIE_NAME = "token-pizzaria";

export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setToken(token: string) {
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

export async function getUser(): Promise<User | null> {
    try {
        const token = await getToken();

        if (!token) {
            return null;
        }

        return await apiClient<User>("/me", {
            token,
            cache: "no-store",
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function isAdmin(user: User | null): boolean {
    return user?.role === "ADMIN";
}

export async function requiredAdmin(): Promise<User> {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    if (!isAdmin(user)) {
        redirect("/access-denied");
    }

    return user;
}
