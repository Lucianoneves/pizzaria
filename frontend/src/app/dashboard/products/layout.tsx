import { requiredAdmin } from "@/lib/auth";

export default async function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requiredAdmin();

    return <>{children}</>;
}
