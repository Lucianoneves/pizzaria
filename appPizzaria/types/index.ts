export interface User {
   id: string;
   name: string;
   email: string;
   createdAt?: string;
   role: "ADMIN" | "STAFF";

}

export interface LoginResponse {
   id: string;
   name: string;
   email: string;
   role: "ADMIN" | "STAFF";
   token: string;
}

export interface Category {
   id: string;
   name: string;

}

export interface Product {
   id: string;
   name: string;
   price: number;
   description: string;
   banner: string;
   category_Id: string;
   createdAt: string;
   disabled: boolean;
   category?: Category;
}



export interface Item {
   id: string;
   name: string;
   amount: number;
   order_Id?: string;
   product_Id?: string;
   product?: Product;
   createdAt?: string;
}

export interface Order {
   id: string;
   table: number;
   name?: string;
   draft: boolean;
   status: boolean;
   createdAt: string;
   items?: Item[];
}

export interface CreateOrderRequest {
   table: number;
   name: string;
}

export interface AddItemRequest {

   order_id: string;
   product_id: string;
   amount: number;

}
export interface SendOrderRequest {
   order_id: string;

}
