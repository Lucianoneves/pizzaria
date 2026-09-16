"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";

export type FinishOrderState = {
    success: boolean;
    error: string | null;
};

export async function finishOrdersAction(
    orderId: string,
): Promise<FinishOrderState> {
    if (!orderId) {
        return { success: false, error: "Pedido não encontrado" };
    }

    const token = await getToken();

    if (!token) {
        return { success: false, error: "Token não encontrado" };
    }

    try {
        await apiClient("/order/finish", {
            method: "PUT",
            body: JSON.stringify({ order_id: orderId }),
            token,
        });
    } catch (error) {
        console.error(error);

        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Falha ao finalizar pedido",
        };
    }

    revalidatePath("/dashboard");

    return { success: true, error: null };
}
