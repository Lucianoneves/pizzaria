"use client";

import { useActionState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
    CardAction,

} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginAction, type LoginState } from "@/actions/auth";

const initialState: LoginState = {
    success: false,
    error: null,
};

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    return (
        <Card className="bg-app-card border  border-app-border w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-white text-2xl font-bold sm:text-4xl">Pizzaria <span className="text-brand-primary">Sabor</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" action={formAction}>

                    {state.error && (
                        <p className="text-sm text-red-400">{state.error}</p>
                    )}

                    {state.success && (
                        <p className="text-sm text-green-400">
                            Login realizado. Redirecionando...
                        </p>
                    )} 

                  

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder=" Digite seu email"
                            required
                            className=" text-white bg-app-card border border-app-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Senha</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder=" Digite sua senha"
                            minLength={4}
                            required
                            className=" text-white bg-app-card border border-app-border"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-brand-primary cursor-pointer text-white hover:bg-brand-primary/90"
                    >
                        {isPending ? "Acessando conta..." : "Acessar"}
                    </Button>

                    <p>
                        Ainda não possui uma conta? <Link href="/register"
                            className=" shimmer-color-brand-primary hover:text-brand-primary/90">
                            Cadastre-se
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>


    )
}