


export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse {
    id: string;
    name: string;
    email: string;
    role: "STAFF" | "ADMIN";
    token: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    banner: string;
    disabled?: boolean;
    category_Id: string;
    createdAt: string;
}


  export interface Item { // itens do pedido
    id: string;
    amount: number;
    product:{
        id: string;
        name: string;
        price: number;
        description: string;
        banner: string;
    }
   
}


export interface Order {  // pedido
    id: string;
    name?: string;
    table: number;
    status: boolean;  // true = Finalizado, false = produção
    draft: boolean; // true = rascunho, false = enviar para produção
    createdAt: string;
    updatedAt: string;
}