"use server";

import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api";
import { type AuthResponse, type User } from "@/lib/types";
import { setToken, removeToken } from "@/lib/auth";

export type RegisterState = {
    success: boolean;
    error: string | null;
};

export async function registerAction(
    _prevState: RegisterState,
    formData: FormData,
): Promise<RegisterState> {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (name.length < 4) {
        return { success: false, error: "Nome deve ter pelo menos 4 caracteres" };
    }

    if (!email) {
        return { success: false, error: "Email é obrigatório" };
    }

    if (password.length < 4) {
        return { success: false, error: "Senha deve ter pelo menos 4 caracteres" };
    }

    try {
        const user = await apiClient<User>("/users", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });    

        
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Não foi possível conectar ao servidor",
        };
    }

    redirect("/login");
}


export type LoginState = { // estado da ação de login
    success: boolean;
    error: string | null;
};

export async function loginAction(
    _prevState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email) {
        return { success: false, error: "Email é obrigatório" };
    }

    if (password.length < 4) {
        return { success: false, error: "Senha deve ter pelo menos 4 caracteres" };
    }

    try {
        const response = await apiClient<AuthResponse>("/session", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        await setToken(response.token);


    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Não foi possível conectar ao servidor",
        };
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    await removeToken();
    redirect("/login");
}
