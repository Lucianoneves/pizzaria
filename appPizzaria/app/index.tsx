import { View, Text, StyleSheet,ScrollView,ActivityIndicator } from "react-native";
import { colors, spacing } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext"; 
import { useEffect } from "react";
import {useSegments,useRouter} from "expo-router";




export default function Index() {

  const { loading,signed } = useAuth();
  const segments = useSegments(); // Array de segmentos retorna os segmentos da URL atual ,ex: se tiver login no começo da URL, o segmento será "(authenticated)"
  const router = useRouter();


   useEffect(() => { 
    if(!loading ) return;

     const inAuthGroup = segments[0] === "(authenticated)";  

     if(!signed && inAuthGroup){ // Se o usuário não estiver logado e estiver no grupo de autenticação, redireciona para a página de login
      router.replace("/login");
     }else if(signed && !inAuthGroup){ // Se o usuário estiver logado e não estiver no grupo de autenticação, redireciona para a página de autenticação
      router.replace("/(authenticated)/dashboard")
     }else if(!signed){ // Se o usuário não estiver logado e não estiver no grupo de autenticação, redireciona para a página de login
      router.replace("/login");
     };
     

    },[loading, signed, router]); 
    if(loading){
  return (
    <View style={styles.container}>      
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { 
    flexGrow: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: { 
    gap: spacing.md,  
  }
  
});
