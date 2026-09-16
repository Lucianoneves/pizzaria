"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { type Category } from "@/lib/types";

export type CreateCategoryState = {
    success: boolean;
    error: string | null;
    createdAt: number | null;
};

export async function CreateCategory(
    _prevState: CreateCategoryState,
    formData: FormData,
): Promise<CreateCategoryState> {
    const name = String(formData.get("name") ?? "").trim();
    const token = await getToken();

    if (!token) {
        return { success: false, error: "Não autorizado", createdAt: null };
    }

    if (name.length < 2) {
        return {
            success: false,
            error: "Nome da categoria deve ter pelo menos 2 caracteres",
            createdAt: null,
        };
    }

    try {
        await apiClient<Category>("/category", {
            method: "POST",
            body: JSON.stringify({ name }),
            token,
        });
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Erro ao criar categoria",
            createdAt: null,
        };
    }

    revalidatePath("/dashboard/category");
    return { success: true, error: null, createdAt: Date.now() };
}
