import Link from "next/link";
import { ShoppingCart, Package, Tags, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logoutSidebarAction } from "@/actions/auth";


interface SidebarProps {
    userName: string;
}

const menuItems = [
    {
        title: "Pedidos",
        href: "/dashboard",
        icon: ShoppingCart,
    },
    {
        title: "Produtos",
        href: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Categorias",
        href: "/dashboard/category",
        icon: Tags,
    },
];

export function Sidebar({ userName }: SidebarProps) {
    return (
        <aside className=" hidden lg:flex h-screen w-64 flex-col bg-app-sidebar">
            <div className="border-b border-app-border p-4">
                <h2 className="text-2xl font-bold text-white">
                    Pizzaria<span className="text-brand-primary"> Sabor</span>
                </h2>
                <p className="text-sm text-gray-400">Bem-vindo, {userName}</p>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((menu) => (
                        <li key={menu.href}>
                            <Link
                                href={menu.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 hover:bg-app-card hover:text-white"
                            >
                                <menu.icon className="h-5 w-5" />
                                {menu.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-app-border">  
                <form action={logoutSidebarAction}>
                    <Button  
                        type="submit"
                        variant="outline"
                        className="w-full justify-start gap-3 text-brand-primary hover:text-white hover:bg-transparent"
                        >
                        <LogOut className="w-4 h-4" /> 
                        Sair
                    </Button>
                </form>

                
            </div>
        </aside>
    );
}
