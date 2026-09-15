 
import { LoginForm } from "@/components/forms/login-forms"; 


export default function Login() {
    return(
        <div className=" bg-app-background flex flex-col items-center justify-center min-h-screen">
            <div className="w-full">
            <LoginForm />
            </div>
        </div>
    )   
}