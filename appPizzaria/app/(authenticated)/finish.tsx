import { colors, spacing, fontSize } from "../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { Input } from "../../components/Input";
import { Button } from "../../components/button";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../service/api";

export default function Finish() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const { orderId, order_id, table } = useLocalSearchParams<{
        orderId?: string;
        order_id?: string;
        table: string;
    }>();

    const resolvedOrderId = orderId ?? order_id;
    const [customer, setCustomer] = useState("");

    async function handleFinishOrder() {
        if (!resolvedOrderId) {
            Alert.alert("Erro", "Pedido não encontrado");
            return;
        }

        try {
            setLoading(true);

            await api.put("/order/send", {
                order_id: resolvedOrderId,
                name: customer.trim() || "sem nome",
            });

            Alert.alert("Sucesso", "Pedido enviado para a cozinha");
            router.dismissAll();
            router.replace("/(authenticated)/dashboard");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível finalizar o pedido");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>
                            Deseja finalizar o pedido desta mesa?
                        </Text>
                        <Text style={styles.table}>Mesa {table}</Text>
                    </View>

                    <Input
                        label="Nome do cliente"
                        placeholder="Digite o nome do cliente"
                        placeholderTextColor={colors.gray}
                        value={customer}
                        onChangeText={setCustomer}
                    />

                    <Button
                        style={styles.finishButton}
                        Loading={loading}
                        disabled={loading}
                        variant="primary"
                        title="Finalizar pedido"
                        onPress={handleFinishOrder}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    content: {
        width: "100%",
        gap: spacing.lg,
    },
    headerText: {
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    title: {
        color: colors.primary,
        fontSize: fontSize.xl,
        fontWeight: "bold",
        textAlign: "center",
    },
    table: {
        color: colors.brand,
        fontSize: fontSize.xxl,
        fontWeight: "bold",
        textAlign: "center",
    },
    finishButton: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
});
