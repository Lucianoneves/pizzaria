import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { type Category, type Product } from "@/lib/types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "@/components/dashboard/product-form";
import { DeleteButtonProduct } from "@/components/dashboard/delete-button";



const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export default async function ProductsPage() {
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    const [products, categories] = await Promise.all([
        apiClient<Product[]>("/product", {
            token,
            cache: "no-store",
        }),
        apiClient<Category[]>("/category", {
            token,
            cache: "no-store",
        }),
    ]);

    const categoryNameById = new Map(
        categories.map((category) => [category.id, category.name]),
    );

    return (
        <div className="px-4 py-10 text-white">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Produtos</h1>
                    <p className="text-sm text-white/70">
                        Total de produtos: {products.length}
                    </p>
                </div>

                <ProductForm categories={categories} />
            </div>

            {products.length === 0 ? (
                <p className="text-center text-white/70">
                    Nenhum produto cadastrado.
                </p>
            ) : (
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <li key={product.id}>
                            <Card className="flex h-full flex-col overflow-hidden border border-app-border bg-app-card transition-colors hover:border-brand-primary/60">
                                <img
                                    src={product.banner}
                                    alt={product.name}
                                    className="h-40 w-full object-cover"
                                />

                                <p className="px-(--card-spacing) pt-3 text-xs font-medium text-white/50">
                                    {categoryNameById.get(product.category_Id) ??
                                        "Sem categoria"}
                                </p>

                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between gap-2 text-lg text-white">
                                        <span>{product.name}</span>
                                        <DeleteButtonProduct productId={product.id} />
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <p className="line-clamp-2 text-sm text-white/70">
                                        {product.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="border-app-border bg-transparent">
                                    <p className="text-base font-semibold text-brand-primary">
                                        {currencyFormatter.format(product.price)}
                                    </p>
                                </CardFooter>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
