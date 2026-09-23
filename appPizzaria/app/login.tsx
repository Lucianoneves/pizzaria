import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  
} from "react-native";
import { colors, fontSize, spacing } from "../constants/theme";
import { Input } from "../components/Input";
import { Button } from "../components/button";
import { useState } from "react"; 
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";





export default function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const router = useRouter();
    const [loading, setLoading] = useState(false);



    async function handleLogin() {  

        if (!email.trim() || !password.trim()) { 
            Alert.alert("Erro", "Email e senha são obrigatórios");
            return;         
    }

    try{
        setLoading(true); 
        await  signIn(email, password);
        router.replace("/(authenticated)/dashboard"); 

    }catch(error) { 
        console.log(error);
        const isNetworkError =
          error instanceof Error && error.message === "Network Error";
        Alert.alert(
          "Erro",
          isNetworkError
            ? "Não foi possível conectar ao servidor. Confira se o backend está ligado e se o celular está na mesma rede Wi-Fi."
            : "Erro ao fazer login",
        ); 
    } finally{ 
        setLoading(false);
    }
} 





  return (
    <KeyboardAvoidingView style={styles.container} behavior={ "padding" }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.title}>Pizzaria</Text>
          <Text style={styles.title2}>+++ Sabor</Text>
          <Text style={styles.subtitle}>Garçom do app</Text>
        </View>

        <View style={styles.formContainer}>
            <Input 
            label="Email"
            placeholder="Digite seu email..." 
            placeholderTextColor={colors.gray}  
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            />
            
            <Input 
            label="Senha"
            placeholder="Digite sua senha..." 
            placeholderTextColor={colors.gray}   
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            keyboardType="visible-password"
            />
            <Button title="Entrar" 
            onPress={handleLogin}
            variant="primary" Loading={loading} />             

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  title2: {
    color: colors.red,
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: colors.gray,
    fontSize: fontSize.md,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  formContainer: {
    width: "100%",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
