


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