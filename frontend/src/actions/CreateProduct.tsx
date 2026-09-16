"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { type Product } from "@/lib/types";

export type CreateProductState = {
    success: boolean;
    error: string | null;
    createdAt: number | null;
};

function getUploadedFile(value: FormDataEntryValue | null): File | null {
    if (!value || typeof value === "string") {
        return null;
    }

    if (typeof value.size === "number" && value.size > 0 && "arrayBuffer" in value) {
        return value as File;
    }

    return null;
}

export async function CreateProduct(
    _prevState: CreateProductState,
    formData: FormData,
): Promise<CreateProductState> {
    const token = await getToken();

    if (!token) {
        return { success: false, error: "Não autorizado", createdAt: null };
    }

    const name = String(formData.get("name") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const category_id = String(formData.get("category_id") ?? "").trim();
    const file = getUploadedFile(formData.get("file"));

    if (!name) {
        return { success: false, error: "O nome do produto é obrigatório", createdAt: null };
    }

    if (!price || Number(price) <= 0) {
        return { success: false, error: "O preço do produto é obrigatório", createdAt: null };
    }

    if (!description) {
        return { success: false, error: "A descrição do produto é obrigatória", createdAt: null };
    }

    if (!category_id) {
        return { success: false, error: "A categoria do produto é obrigatória", createdAt: null };
    }

    if (!file) {
        return { success: false, error: "A imagem do produto é obrigatória", createdAt: null };
    }

    const bytes = await file.arrayBuffer();
    const fileName = file.name || "produto.jpg";
    const mimeType = file.type || "image/jpeg";
    const uploadFile = new File([bytes], fileName, { type: mimeType });

    const body = new FormData();
    body.append("name", name);
    body.append("price", price);
    body.append("description", description);
    body.append("category_id", category_id);
    body.append("file", uploadFile);

    try {
        await apiClient<Product>("/product", {
            method: "POST",
            body,
            token,
            cache: "no-store",
        });
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Erro ao criar produto",
            createdAt: null,
        };
    }

    revalidatePath("/dashboard/products");
    return { success: true, error: null, createdAt: Date.now() };
}

export type DeleteProductState = {
    success: boolean;
    error: string | null;
    deletedAt: number | null;
};

export async function DeleteProductAction(
    productId: string,
): Promise<DeleteProductState> {
    if (!productId) {
        return { success: false, error: "O ID do produto é obrigatório", deletedAt: null };
    }

    const token = await getToken();

    if (!token) {
        return { success: false, error: "Não autorizado", deletedAt: null };
    }

    try {
        await apiClient(
            `/product?product_id=${encodeURIComponent(productId)}&disable=true`,
            {
                method: "DELETE",
                token,
            },
        );
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Erro ao deletar produto",
            deletedAt: null,
        };
    }

    revalidatePath("/dashboard/products");
    return { success: true, error: null, deletedAt: Date.now() };
}
