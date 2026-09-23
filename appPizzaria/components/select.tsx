import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { borderRadius, colors, fontSize, spacing } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

interface SelectOptions {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    options: SelectOptions[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function Select({
    label,
    options,
    selectedValue,
    onChange,
    placeholder = "Selecione uma opção",
}: SelectProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const selectedOption = options.find((option) => option.value === selectedValue);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    function handleSelect(value: string) {
        onChange(value);
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Pressable style={styles.selectButton} onPress={() => setModalVisible(true)}>
                <Text style={selectedOption ? styles.selectText : styles.placeholderText}>
                    {displayText}
                </Text>
                <Feather name="chevron-down" size={20} color={colors.primary} />
            </Pressable>

            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.overlay}
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable style={styles.modalContent} onPress={() => { }}>
                        <Text style={styles.modalTitle}>{label || placeholder}</Text>
                        <ScrollView>
                            {options.length === 0 ? (
                                <Text style={styles.emptyText}>Nenhuma opção disponível</Text>
                            ) : (
                                options.map((option) => {
                                    const isSelected = option.value === selectedValue;
                                    return (
                                        <Pressable
                                            key={option.value}
                                            style={[styles.option, isSelected && styles.optionSelected]}
                                            onPress={() => handleSelect(option.value)}
                                        >
                                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                                {option.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })
                            )}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    label: {
        color: colors.primary,
        fontSize: fontSize.sm,
        marginBottom: spacing.sm,
    },
    selectButton: {
        height: 48,
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.borderColor,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: spacing.md,
    },
    selectText: {
        color: colors.primary,
        flex: 1,
        fontSize: fontSize.lg,
    },
    placeholderText: {
        color: colors.gray,
        flex: 1,
        fontSize: fontSize.lg,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.borderColor,
        maxHeight: "60%",
        paddingVertical: spacing.sm,
    },
    modalTitle: {
        color: colors.primary,
        fontSize: fontSize.md,
        fontWeight: "600",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    emptyText: {
        color: colors.gray,
        padding: spacing.md,
    },
    option: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    optionSelected: {
        backgroundColor: colors.background,
    },
    optionText: {
        color: colors.primary,
        fontSize: fontSize.lg,
    },
    optionTextSelected: {
        color: colors.green,
        fontWeight: "600",
    },
});
