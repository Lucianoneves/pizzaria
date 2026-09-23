import { createContext, useContext, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      await loadStorageData();
    }
    loadData();
  }, []); 


    async function loadStorageData() { 
      try{ 
        setLoading(true);
        const storageToken = await AsyncStorage.getItem("@token:pizzaria");
        const storageUser = await AsyncStorage.getItem("@user:pizzaria");

       

        if(storageToken && storageUser){
          setUser(JSON.parse(storageUser));
          setSigned(true);
        }

      }catch(error){
        console.log(error);
      }finally{
        setLoading(false); 
      } 
      
    
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }



  async function signOut() {    // Função para deslogar o usuário   
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
