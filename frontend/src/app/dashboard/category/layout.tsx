import { requiredAdmin } from "@/lib/auth";

export default async function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requiredAdmin();

    return <>{children}</>;
}
