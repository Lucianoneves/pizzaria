import { Item } from "../types";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { borderRadius, colors, fontSize, spacing } from "../constants/theme";
import { formatPrice } from "../utils/format";

interface OrderItemProps {
    item: Item;
    onRemove: ( item_id: string ) => Promise<void>;
}

export function OrderItem({ item, onRemove }: OrderItemProps) {
    const unitPrice = item.product?.price ?? 0;
    const totalPrice = unitPrice * item.amount;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.productName}>{item.product?.name ?? item.name}</Text>
                <Text style={styles.productDetail}>
                    {item.amount} x {formatPrice(unitPrice)} = {formatPrice(totalPrice)}
                </Text>
            </View>

            <Pressable style={styles.deleteButton} onPress={ () => onRemove(item.id)}>
                <Feather name="trash-2" size={20} color={colors.primary} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    content: {
        flex: 1,
    },
    productName: {
        color: colors.primary,
        fontSize: fontSize.md,
        marginBottom: 4,
    },
    productDetail: {
        color: colors.gray,
        fontSize: fontSize.sm,
    },
    deleteButton: {
        backgroundColor: colors.red,
        padding: spacing.sm,
        borderRadius: 8,
    },
});
