import { AccessDenied } from "./access-denied";

export default function AccessDeniedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-app-background px-4">
            <div className="w-full">
                <AccessDenied />
            </div>
        </div>
    );
}
