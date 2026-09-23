import { View, Text, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Button } from "react-native"; 
import { useAuth } from "../../contexts/AuthContext";
import { borderRadius, colors, fontSize, spacing } from "../../constants/theme";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { Input } from "../../components/Input";


export default function Dashboard() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();


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
        <TouchableOpacity style={styles.signOutButton}>
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
        />

        <Button title="Abrir mesa" onPress={() => {}} />

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