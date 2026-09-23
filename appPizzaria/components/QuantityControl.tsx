import { View, Text, StyleSheet, Pressable } from "react-native"; 
import { colors, fontSize, spacing } from "../constants/theme";

interface QuantityControlProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}


export function QuantityControl({ 
    quantity,
     onIncrement,
      onDecrement,
 }: QuantityControlProps)  {

    return (
        <View style={styles.container}>  
        <Pressable style={styles.button} onPress={onDecrement}>
             <Text style={styles.buttonText}>-</Text> 
             </Pressable>   
             <View style={styles.quantityContainer}>     
                <Text style={styles.quantityText}>{quantity}</Text>             
        </View>
        <Pressable style={styles.button} onPress={onIncrement}> 
            <Text style={styles.buttonText}>+</Text>         
        </Pressable>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }, 
    button: {
        backgroundColor: colors.red,
       paddingVertical:spacing.sm, 
       paddingHorizontal:spacing.sm, 
       borderRadius: 10,
    }, 
    buttonText: {
        fontSize: fontSize.xl,
        fontWeight: "bold",
        color: colors.primary,
    },
    quantityContainer: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.background,
    },
}) 