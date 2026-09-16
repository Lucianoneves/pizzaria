"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Item, Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface OrderModalProps {
    orderId: string | undefined;
    onClose: () => Promise<void>;
    token: string;
}

function getItemSubtotal(item: Item) {
    const price = Number(item.product?.price ?? 0);
    const amount = Number(item.amount ?? 0);

    return price * amount;
}

function calculateOrderTotal(order: Order) {
    if (!order.items || order.items.length === 0) {
        return 0;
    }

    return order.items.reduce((total, item) => total + getItemSubtotal(item), 0);
}

export function OrderModal({ orderId, onClose, token }: OrderModalProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const open = Boolean(orderId);

    useEffect(() => {
        if (!orderId) {
            setOrder(null);
            setError(null);
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function fetchOrder() {
            try {
                setLoading(true);
                setError(null);

                const response = await apiClient<Order>(
                    `/order/detail?order_id=${orderId}`,
                    {
                        method: "GET",
                        token,
                    },
                );

                if (!cancelled) {
                    setOrder(response);
                }
            } catch (err) {
                if (!cancelled) {
                    setOrder(null);
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Falha ao buscar detalhes do pedido",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchOrder();

        return () => {
            cancelled = true;
        };
    }, [orderId, token]);

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    void onClose();
                }
            }}
        >
            <DialogContent className="bg-app-background p-6 text-white sm:max-w-md">
                {loading ? (
                    <p className="text-sm text-white/70">Carregando pedido...</p>
                ) : error ? (
                    <p className="text-sm text-red-400">{error}</p>
                ) : order ? (
                    <>
                        <DialogHeader>
                            <div className="flex items-center justify-between gap-2 pr-8">
                                <DialogTitle className="text-lg font-bold text-white">
                                    Mesa {order.table}
                                </DialogTitle>
                                <Badge variant="secondary" className="select-none text-xs">
                                    produção
                                </Badge>
                            </div>
                            <DialogDescription className="text-sm text-white/70">
                                Cliente: {order.name?.trim() ? order.name : "Não informado"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="max-h-64 space-y-3 overflow-y-auto">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="space-y-1 border-b border-app-border pb-3 last:border-b-0 last:pb-0"
                                    >
                                        <p className="text-sm text-white/90">
                                            {item.amount} x {item.product?.name ?? "Item"}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/50">Subtotal</span>
                                            <span className="text-white/80">
                                                {formatPrice(getItemSubtotal(item))}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-white/60">
                                    Nenhum item neste pedido
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-app-border pt-4">
                            <p className="text-sm text-gray-400">Total</p>
                            <p className="text-lg font-bold text-brand-primary">
                                {formatPrice(calculateOrderTotal(order))}
                            </p>
                        </div>
                    </>
                ) : null}

                <DialogFooter className="mx-0 mb-0 border-app-border bg-transparent p-0 sm:justify-end">
                    <Button
                        variant="outline"
                        className="border-app-border text-white hover:bg-white/10"
                        onClick={() => void onClose()}
                    >
                        Fechar
                    </Button>
                    <Button
                        type="button"
                        className="bg-brand-primary text-white hover:bg-brand-primary/90"
                    >
                        Finalizar pedido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
