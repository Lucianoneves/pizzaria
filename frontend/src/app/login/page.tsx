 
import { LoginForm } from "@/components/forms/login-forms";  
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async  function Login() {
    const user = await getUser(); 

    if (user?.role === "ADMIN") {
        redirect("/dashboard");
    }

    if (user) {
        redirect("/access-denied");
    }
    



    return(
        <div className=" bg-app-background flex flex-col items-center justify-center min-h-screen">
            <div className="w-full">
            <LoginForm />
            </div>
        </div> 
    )   
}