"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    CreateCategory,
    type CreateCategoryState,
} from "@/actions/CreateCategory";

const initialState: CreateCategoryState = {
    success: false,
    error: null,
    createdAt: null,
};

export function CategoryForm() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(
        CreateCategory,
        initialState,
    );
    const router = useRouter();

    useEffect(() => {
        if (!state.createdAt) {
            return;
        }

        setOpen(false);
        router.refresh();
    }, [state.createdAt, router]);

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
            }}
        >
            <DialogTrigger
                render={
                    <Button className="w-full bg-brand-primary text-white hover:bg-brand-primary/90" />
                }
            >
                <Plus className="h-4 w-4" />
                Nova categoria
            </DialogTrigger>

            <DialogContent className="bg-app-background p-6 text-white">
                <DialogHeader>
                    <DialogTitle>Nova categoria</DialogTitle>
                    <DialogDescription>Criando nova categoria</DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {state.error && (
                        <p className="text-sm text-red-400">{state.error}</p>
                    )}
                    <div>
                        <Label htmlFor="name" className="text-white/70">
                            Nome da categoria
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            minLength={2}
                            placeholder="Digite o nome da categoria..."
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
                    >
                        {isPending ? "Criando..." : "Criar categoria"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
