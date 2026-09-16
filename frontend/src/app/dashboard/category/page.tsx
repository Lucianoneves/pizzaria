import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { type Category } from "@/lib/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CategoryForm } from "@/components/dashboard/category-form"; 




export default async function CategoryPage() {
    const token = await getToken();

    if (!token) {
        redirect("/login");
    }

    const categories = await apiClient<Category[]>("/category", {
        token,
        cache: "no-store",
    });

    return (
        <div className="px-4 py-10 text-white">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Categorias</h1>
                <p className="text-sm text-white/70">
                    Total de categorias: {categories.length}
                </p>
            </div> 

            <CategoryForm/>

            {categories.length === 0 ? (
                <p className="text-center text-white/70">
                    Nenhuma categoria cadastrada.
                </p>
            ) : (
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <li key={category.id}>
                            <Card className="h-full border border-app-border bg-app-card">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">
                                        {category.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-white/60">
                                        Cadastrada em{" "}
                                        {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                                    </p>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
