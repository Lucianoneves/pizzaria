 export interface User{
    id: string;
    name: string;
    email: string;  
    createdAt?: string;
    role: "ADMIN" | "STAFF";
  
 }

 export interface LoginResponse{
    id: string; 
    name: string;
    email: string; 
    role: "ADMIN" | "STAFF"; 
    token: string;
 }

 export interface Category{ 
    id: string; 
    name: string;

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