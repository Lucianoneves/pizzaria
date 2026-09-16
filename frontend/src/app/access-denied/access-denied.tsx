import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { ShieldOff } from "lucide-react";
import { redirect } from "next/navigation";

export async function AccessDenied() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <Card className="mx-auto w-full max-w-md border border-app-border bg-app-card">
            <CardHeader className="items-center text-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-full border border-app-border bg-app-background">
                    <ShieldOff className="size-6 text-brand-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-white sm:text-4xl">
                    Acesso <span className="text-brand-primary">negado</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                    Você não tem permissão para acessar o painel.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <p className="text-sm text-white/70">
                    Somente administradores podem acessar o dashboard, categorias e
                    produtos.
                </p>
                <p className="text-sm text-white/70">
                    Caso ache que isso é um erro, consulte o administrador.
                </p>
                <form action={logoutAction}>
                    <Button
                        type="submit"
                        className="w-full cursor-pointer bg-brand-primary text-white hover:bg-brand-primary/90"
                    >
                        Sair
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
