import { RegisterForm } from "@/components/forms/register"; 



export default function Register() {
    return(
        <div className=" bg-app-background flex flex-col items-center justify-center min-h-screen">
            <div className="w-full">
            <RegisterForm />
            </div>
        </div>
    )   
}