"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import { Plus, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CreateProduct,
    type CreateProductState,
} from "@/actions/CreateProduct";
import { type Category } from "@/lib/types";
const initialState: CreateProductState = {
    success: false,
    error: null,
    createdAt: null,
};

interface ProductFormProps {
    categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
    const [open, setOpen] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [priceDigits, setPriceDigits] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, formAction, isPending] = useActionState(
        CreateProduct,
        initialState,
    );
    const router = useRouter();

    useEffect(() => {
        if (!state.createdAt) {
            return;
        }

        setOpen(false);
        setCategoryId("");
        setPriceDigits("");
        setImageFile(null);
        setImagePreview(null);
        setImageError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        router.refresh();
    }, [state.createdAt, router]);

    const priceAmount = priceDigits ? parseFloat(priceDigits) / 100 : 0;
    const priceDisplay = priceDigits
        ? priceAmount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
        : "";
    const priceRawValue = priceDigits ? priceAmount.toFixed(2) : "";

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const digits = e.target.value.replace(/[^0-9]/g, "");
        setPriceDigits(digits);
    }


    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > 1024 * 1024 * 5) {
            return;
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }


    function clearImage(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        setImageError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }






    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className="bg-brand-primary text-white hover:bg-brand-primary/90" />
                }
            >
                <Plus className="h-4 w-4" />
                Novo produto
            </DialogTrigger>

            <DialogContent className="bg-app-background p-6 text-white lg:top-4 lg:-auto lg:right-4 lg:translate-x-0 lg:translate-y-0">
                <DialogHeader>
                    <DialogTitle>Novo produto</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo produto no cardápio
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {state.error && (
                        <p className="text-sm text-red-400">{state.error}</p>
                    )}

                    <div>
                        <Label htmlFor="name" className="text-white/70">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Digite o nome do produto..."
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>

                    <div>
                        <Label htmlFor="price" className="text-white/70">
                            Preço
                        </Label>
                        <Input
                            id="price"
                            type="text"
                            inputMode="numeric"
                            required
                            placeholder="R$ 0,00"
                            className="border-app-border bg-app-background text-white"
                            value={priceDisplay}
                            onChange={handlePriceChange}
                        />
                        <input type="hidden" name="price" value={priceRawValue} />
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-white/70">
                            Descrição
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Digite a descrição do produto..."
                            className="border-app-border bg-app-background text-white"
                        />
                    </div>

                    <div>
                        <Label htmlFor="category_id" className="text-white/70">
                            Categoria
                        </Label>
                        <Select value={categoryId} onValueChange={(value) => setCategoryId(value ?? "")}>
                            <SelectTrigger className="w-full border-app-border bg-app-background text-white">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="category_id" value={categoryId} />
                    </div>



                    <div>
                        <Label htmlFor="file" className="text-white/70">
                            Imagem do produto
                        </Label>
                        <label
                            htmlFor="file"
                            className="mt-1 flex h-40 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-app-border bg-app-background"
                        >
                            {imagePreview ? (
                                <div className="relative h-full w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imagePreview}
                                        alt="Imagem do produto"
                                        className="h-full w-full object-cover"
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500/90"
                                    >
                                        Excluir imagem
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-white/60">
                                    <Upload className="h-10 w-10" />
                                    <span className="text-sm">
                                        Clique para selecionar uma imagem
                                    </span>
                                </div>
                            )}
                        </label>
                        <input
                            ref={fileInputRef}
                            id="file"
                            name="file"
                            type="file"
                            accept="image/png,image/jpeg"
                            required
                            className="sr-only"
                            onChange={handleImageChange}
                        />
                        {imageError && (
                            <p className="mt-2 text-sm text-red-400">{imageError}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || !categoryId || !priceDigits || !imageFile}
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
                    >
                        {isPending ? "Criando..." : "Criar produto"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
