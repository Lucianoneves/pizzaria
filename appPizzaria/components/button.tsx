import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { colors, spacing, fontSize } from "../constants/theme";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant: "primary" | "secondary";
    Loading?: boolean;
}



export function Button({
    title,
    variant = "primary",
    Loading = false,
    disabled,
    style,
    ...rest
}: ButtonProps) {

    const backgroundColor = variant === "primary" ? colors.green : colors.brand;
    return (
        <TouchableOpacity
            style={[
                { backgroundColor: backgroundColor },
                styles.button,
                (disabled || Loading) && styles.buttonDisabled,
                style,
            ]}
            {...rest}
        >
            {Loading ? (<ActivityIndicator color={colors.background} />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    )

}



const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#000",
        padding: 16,
        marginBottom: 16,
        marginTop: 16,

    },
    buttonDisabled: {
        opacity: 0.5,
    },

    buttonText: {
        color: colors.background,
        fontSize: fontSize.lg,
        fontWeight: "600",
    }
});