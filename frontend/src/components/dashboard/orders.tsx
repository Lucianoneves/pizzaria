"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Order } from "@/lib/types";
import { apiClient } from "@/lib/api";

interface OrdersProps {
    token: string;
}



function Orders({ token }: OrdersProps) {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {

            const response = await apiClient<Order[]>("/order?draft=true", {
                method: "GET",
                cache: "no-store",
                token: token,
            });

            setOrders(response);

            ;
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



    return (
        <div className="px-4 py-10 text-white">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pedidos</h1>
                    <p className="text-sm text-white/70">
                        Gerencie Pedidos da cozinha

                    </p>
                </div>

                <Button className=" hover:bg-brand-primary/90">
                    <RefreshCcw className="h-4 w-4" />

                </Button>
            </div>


        </div>
    );
}

export default Orders;