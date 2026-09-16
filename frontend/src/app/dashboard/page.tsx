 import Orders from "@/components/dashboard/orders";
import { getToken } from "@/lib/auth";

 

export default  async function DashboardPage() { 

    const token = await getToken();


    return  <Orders token={token!} />;    
      
}