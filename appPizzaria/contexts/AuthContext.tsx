import { createContext, useContext, useState } from "react";
import api from "../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, User } from "../types/index";
import { AxiosError } from "axios";


interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post<LoginResponse>("/session", {
        email,
        password,
      });

      const { token, ...userData } = response.data;

      await AsyncStorage.setItem("@token:pizzaria", token);
      await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userData));

      setUser(userData);
      setSigned(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        console.log(error.response.data.error);
      } else {
        console.log(error);
      }
      throw error;
    }
  }

  async function signOut() {
    await AsyncStorage.multiRemove(["@token:pizzaria", "@user:pizzaria"]);
    setUser(null);
    setSigned(false);
  }



  return (
    <AuthContext.Provider
      value={{
        signed: !!user, // !!user é um operador ternário que verifica se o usuário é verdadeiro ou falso
        loading,
        signIn,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("contexto não foi encontrado");
  }

  return context;
}
