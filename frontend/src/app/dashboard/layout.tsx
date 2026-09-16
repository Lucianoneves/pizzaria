import { requiredAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobileSidebar"; 


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requiredAdmin();

    return (
        <div className="flex min-h-screen overflow-hidden bg-app-background text-white">
            {/* sidebar para DESKTOP*/}
            <Sidebar userName={user.name} />



            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <MobileSidebar userName={user.name} />
                <main className="flex-1 overflow-y-auto bg-app-background">
                    {children}
                </main>
            </div>
            </div>
            
    );
}
