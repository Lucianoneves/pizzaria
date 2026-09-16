import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
    return (
        <div className="bg-app-background flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <h1 className="text-2xl font-bold text-white sm:text-4xl">
                    Acesso <span className="text-brand-primary">negado</span>
                </h1>
                <p className="text-white/70">
                    Somente administradores podem acessar o dashboard, categorias e produtos.
                </p>
                <form action={logoutAction}>
                    <Button
                        type="submit"
                        className="cursor-pointer bg-brand-primary text-white hover:bg-brand-primary/90"
                    >
                        Sair
                    </Button>
                </form>
            </div>
        </div>
    );
}
