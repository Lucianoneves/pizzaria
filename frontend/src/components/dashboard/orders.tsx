"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, RefreshCcw } from "lucide-react";
import { Order } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format";
import { OrderModal } from "./order-Modal";

interface OrdersProps {
    token: string;
}



function Orders({ token }: OrdersProps) {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);




    const fetchOrders = async () => {
        try {

            const response = await apiClient<Order[]>("/order?draft=false", {
                method: "GET",
                cache: "no-store",
                token: token,
            });

            const pendingOrders = response.filter((order) => !order.status);

            setOrders(pendingOrders);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }

    }

    useEffect(() => {
        async function loadOrders() {
            await fetchOrders();
        }
        loadOrders();
    }, []);


    const calculateOrderTotal = (order: Order) => {
        if (!order.items || order.items.length === 0) {
            return 0;
        }

        return order.items.reduce((total, item) => {
            const price = Number(item.product?.price ?? 0);
            const amount = Number(item.amount ?? 0);

            return total + price * amount;
        }, 0);
    };



    return (
        <div className="px-4 py-10 text-white">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pedidos</h1>
                    <p className="text-sm text-white/70">
                        Gerencie Pedidos da cozinha

                    </p>
                </div>

                <Button className=" hover:bg-brand-primary/90"
                    onClick={async () => await fetchOrders()}>
                    <RefreshCcw className="h-4 w-4" />

                </Button>
            </div>

            {loading ? (
                <div>
                    <p className="text-center text-gray-400">Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div>
                    <p className="text-center text-gray-400">Nenhum pedido encontrado</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <Card
                            key={order.id}
                            className="bg-app-card border-app-border text-white"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="text-lg font-bold lg:text-xl">
                                        Mesa {order.table}
                                    </CardTitle>
                                    <Badge variant="secondary" className="select-none text-xs">
                                        produção
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-auto space-y-2 sm:space-y-4">
                                {order.items && order.items.length > 0 ? (
                                    <div className="space-y-2">
                                        {order.items.slice(0, 2).map((item) => (
                                            <p key={item.id} className="text-sm text-white/80">
                                                {item.amount} x {item.product?.name}
                                            </p>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-xs text-white/50">
                                                +{order.items.length - 2} item(ns)
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-white/60">
                                        Nenhum item neste pedido
                                    </p>
                                )}

                                <div className=" flex flex-col xl:flex-row items-center justify-between border-t pt-4 gap-4
                                border-app-border">

                                    <div className=" self-start">
                                        <p className=" text-sm  md:text-base text-gray-400">Total</p>
                                        <p className="  text-base font-bold md:text-xl text-brand-primary">
                                            {formatPrice(calculateOrderTotal(order))}
                                        </p>
                                    </div>

                                    <Button
                                        size="sm"
                                        className="w-full bg-brand-primary hover:bg-brand-primary/90 xl:w-auto"
                                        onClick={() => setSelectedOrder(order.id === selectedOrder?.id ? null : order)}
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        Detalhes
                                    </Button>

                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <OrderModal
                orderId={selectedOrder?.id}
                onClose={async () => {
                    setSelectedOrder(null);
                    await fetchOrders();
                }}
                token={token}
            />
        </div>
    );
}

export default Orders;