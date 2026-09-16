"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Package, Tags, ShoppingCart, Menu, LogOut } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { logoutSidebarAction } from "@/actions/auth";

interface MobileSidebarProps {
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

export function MobileSidebar({ userName }: MobileSidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    function isActive(href: string) {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return pathname.startsWith(href);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-app-border bg-app-card lg:hidden">
            <div className="flex h-16 items-center justify-between px-4">
                <h2 className="text-lg font-bold text-white">
                    Pizzaria<span className="text-brand-primary"> Sabor</span>
                </h2>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-app-background"
                            />
                        }
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Abrir menu</span>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-72 bg-app-sidebar p-0 text-white border-app-border"
                    >
                        <SheetHeader className="border-b border-app-border">
                            <SheetTitle className="text-xl font-bold text-white">
                                Pizzaria<span className="text-brand-primary"> Sabor</span>
                            </SheetTitle>
                            <SheetDescription className="text-sm text-gray-400">
                                Bem-vindo, {userName}
                            </SheetDescription>
                        </SheetHeader>

                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {menuItems.map((menu) => (
                                    <li key={menu.href}>
                                        <Link
                                            href={menu.href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                                                isActive(menu.href)
                                                    ? "bg-app-card text-white"
                                                    : "text-white/80 hover:bg-app-card hover:text-white"
                                            }`}
                                        >
                                            <menu.icon className="h-5 w-5" />
                                            {menu.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <SheetFooter className="border-t border-app-border">
                            <form action={logoutSidebarAction}>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="w-full justify-start gap-3 border-app-border bg-transparent text-brand-primary hover:bg-transparent hover:text-white"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sair
                                </Button>
                            </form>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
