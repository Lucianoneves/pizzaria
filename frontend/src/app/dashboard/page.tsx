import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { type User } from "@/lib/types";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    let user: User;

    try {
        user = await apiClient<User>("/me", {
            token,
            cache: "no-store",
        });
    } catch {
        redirect("/login");
    }

    return (
        <div className="bg-app-background min-h-screen px-4 py-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-4xl">
                            Pizzaria <span className="text-brand-primary">Sabor</span>
                        </h1>
                        <p className="mt-2 text-white/80">
                            Olá, {user.name}
                        </p>
                        <p className="text-sm text-white/60">{user.email} · {user.role}</p>
                    </div>
                    <form action={logoutAction}>
                        <Button
                            type="submit"
                            className="cursor-pointer bg-brand-primary text-white hover:bg-brand-primary/90"
                        >
                            Sair
                        </Button>
                    </form>
                </header>

                <section className="grid gap-4 sm:grid-cols-3">
                    <Card className="border border-app-border bg-app-card">
                        <CardHeader>
                            <CardTitle className="text-white">Pedidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/70">Abrir, enviar e finalizar mesas.</p>
                        </CardContent>
                    </Card>
                    <Card className="border border-app-border bg-app-card">
                        <CardHeader>
                            <CardTitle className="text-white">Produtos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/70">Cardápio e imagens no Cloudinary.</p>
                        </CardContent>
                    </Card>
                    <Card className="border border-app-border bg-app-card">
                        <CardHeader>
                            <CardTitle className="text-white">Categorias</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/70">Organizar o cardápio por tipo.</p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
