import { View, Text, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Button, Alert } from "react-native"; 
import { useAuth } from "../../contexts/AuthContext";
import { borderRadius, colors, fontSize, spacing } from "../../constants/theme";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { Input } from "../../components/Input";
import { useState } from "react";
import  api  from "../../service/api";
import { Order } from "../../types";
import { useRouter } from "expo-router";




export default function Dashboard() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [tableNumber, setTableNumber] = useState(""); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();



   async function handleOpenTable() {
     if(!tableNumber) {
      Alert.alert("Atenção..");
      return;
  }

  const table = parseInt(tableNumber); 

  if(isNaN(table)|| table <= 0) {
    Alert.alert("Atenção..", "Digite um número de mesa válido");
    return;
  } 

  try {  
    setLoading(true);  
    const response = await api.post<Order>("/order", {
      table,
      name: `Mesa ${table}`,
    });

    router.push({
      pathname: "/(authenticated)/order",
      params: {
        table: String(response.data.table),
        orderId: response.data.id,
      },
    });

  

    setTableNumber("");
  } catch (error) {
    console.log(error);
    Alert.alert("Erro", "Não foi possível abrir a mesa"); 
  } finally {
    setLoading(false);
  }
  }


  return (
    <View style={styles.container}>
       <StatusBar barStyle="light-content" backgroundColor={colors.brand} />
      

      <KeyboardAvoidingView 

      style={styles.KeyboardContainer} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
     > 
     <ScrollView 
     contentContainerStyle={styles.scrollContent} 
     keyboardShouldPersistTaps="handled" 

     
     >
      <View style={[styles.header, {paddingTop: insets.top +70}]}>
        <TouchableOpacity style={styles.signOutButton}onPress={signOut}>
          <Text style={styles.signoutText}>Sair</Text>
        </TouchableOpacity>
      </View> 


     <View style={styles.content}> 

     <View>
          <Text style={styles.title}>Pizzaria</Text>
          <Text style={styles.title2}>+++ Sabor</Text>         
        </View>

        <Text style={styles.title3}>Novo pedido</Text> 
        <Input 
        label=""
        placeholder="Numero da mesa..."
        style={styles.input}
        placeholderTextColor={colors.gray} 
        value={tableNumber}
        onChangeText={setTableNumber} 
        keyboardType="numeric"
        />

        <Button title="Abrir mesa" onPress={handleOpenTable} />

     </View>



     </ScrollView>
     </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  } ,
  KeyboardContainer: {
    flex: 1,    
  },   
  scrollContent:{
    flexGrow: 1,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm, 
  },
  signOutButton: { 
    backgroundColor: colors.red,
    paddingVertical: spacing.sm, 
    paddingHorizontal: spacing.md, 
    borderRadius: borderRadius.md, 
  },
  signoutText: { 
    color: colors.primary,
    fontSize: fontSize.md,  
  },
  content: {  
    flex: 1, 
    justifyContent: "center",  
    paddingHorizontal: spacing.xl,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.md,
    
  },
  title2: {
    color: colors.red,
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  title3: {
    fontWeight: "bold",
    color: colors.gray,
    fontSize: fontSize.md,
    textAlign: "center",
    marginTop: spacing.sm,
    backgroundColor: colors.background,
  },
  input: { 
    marginBottom: spacing.md, 
  }

  });