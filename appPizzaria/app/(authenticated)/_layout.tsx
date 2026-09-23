

import { Stack } from "expo-router"; 
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { colors } from "../../constants/theme";

export default function AuthenticatedLayout() { // Layout para as rotas autenticadas

  const {loading, signed} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!loading && !signed){
      router.replace("/login");
    }
  }, [loading, signed]); 

  if (loading || !signed) {
    return null;
  }

  return ( // Stack para as rotas autenticadas
    <Stack 
    screenOptions={{
       headerShown: true,
       headerStyle: {
        backgroundColor: colors.background,
       },
       headerTintColor: colors.primary,
       headerTitleStyle: {
        fontWeight:"600"
       },
       headerShadowVisible: false,
       
        }}
        >
      <Stack.Screen name="dashboard" options ={{headerShown: false}} />
      <Stack.Screen name="order" options ={{headerShown: false}} />
    </Stack>
  );
}