import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fontSize, spacing } from "../../constants/theme";
import { useEffect, useState } from "react";
import { Category, Item, Product } from "../../types";
import api from "../../service/api";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Select } from "../../components/select";
import { QuantityControl } from "../../components/QuantityControl";
import { Button } from "../../components/button";
import { OrderItem } from "../../components/OrderItem";

export default function Order() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [quantity, setQuantity] = useState(1);

    const { table, orderId } = useLocalSearchParams<{
        table: string;
        orderId: string;
    }>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingAddItem, setLoadingAddItem] = useState(false);

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        async function loadingCategories() {
            await loadCategories();
        }

        loadingCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadProducts(selectedCategory);
        } else {
            setProducts([]);
        }
    }, [selectedCategory]);

    async function loadCategories() {
        try {
            setLoadingCategories(true);
            const response = await api.get<Category[]>("/category");
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCategories(false);
        }
    }

    async function loadProducts(categoryId: string) {
        try {
            setLoadingProducts(true);

            const response = await api.get<Product[]>("/category/product", {
                params: { category_id: categoryId },
            });

            setProducts(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingProducts(false);
        }
    }

    async function handleAddItem() {
        try {
            setLoadingAddItem(true);
            const response = await api.post<Item>("/order/add", {
                order_id: orderId,
                product_id: selectedProduct,
                amount: quantity,
            });

            setItems((current) => [...current, response.data]);
            setSelectedProduct("");
            setQuantity(1);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingAddItem(false);
        }
    }

    async function handleRemoveItem(item_id: string) {
        try {
             await api.delete<Item>("/order/remove", {
                params: { item_id },
               
            }); 

            const updateItems = items.filter((item) => item.id !== item_id);
            setItems(updateItems);  
            
            Alert.alert("Item removido com sucesso");
          
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao remover item da mesa");
        } 
    }

    if (loadingCategories) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Mesa {table}</Text>

                    <Pressable
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="trash" size={20} color={colors.primary} />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Select
                    label="Categorias"
                    placeholder="Selecione a categoria..."
                    options={categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                    }))}
                    selectedValue={selectedCategory}
                    onChange={setSelectedCategory}
                />

                {loadingProducts ? (
                    <ActivityIndicator size="large" color={colors.brand} />
                ) : (
                    selectedCategory && (
                        <Select
                            placeholder="Selecione o produto..."
                            options={products.map((product) => ({
                                label: product.name,
                                value: product.id,
                            }))}
                            selectedValue={selectedProduct}
                            onChange={setSelectedProduct}
                        />
                    )
                )}

                {!!selectedCategory && !loadingProducts && (
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Quantidade</Text>
                        <QuantityControl
                            quantity={quantity}
                            onIncrement={() => setQuantity((current) => current + 1)}
                            onDecrement={() =>
                                setQuantity((current) => (current > 1 ? current - 1 : current))
                            }
                        />
                    </View>
                )}

                {selectedProduct && (
                    <Button
                        style={styles.addButton}
                        title="Adicionar"
                        onPress={handleAddItem}
                        variant="secondary"
                        Loading={loadingAddItem}
                        disabled={loadingAddItem}
                    />
                )}

                {items.length > 0 && (
                    <View style={styles.itemsSection}>
                        <Text style={styles.itemsTitle}>Itens adicionados</Text>
                        {items.map((item) => (
                            <OrderItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.lg,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: 15,
    },
    header: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        color: colors.primary,
        fontSize: fontSize.xxl,
        fontWeight: "bold",
    },
    closeButton: {
        backgroundColor: colors.red,
        padding: spacing.sm,
        borderRadius: 8,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    quantitySection: {
        width: "100%",
        marginTop: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    quantityLabel: {
        fontSize: fontSize.lg,
        color: colors.primary,
        fontWeight: "bold",
        marginRight: spacing.md,
    },
    itemsSection: {
        marginTop: spacing.xl,
        gap: spacing.md,
    },
    itemsTitle: {
        fontSize: fontSize.lg,
        color: colors.primary,
        fontWeight: "bold",
    },
    addButton: {
        marginTop: spacing.lg,
    },
});
