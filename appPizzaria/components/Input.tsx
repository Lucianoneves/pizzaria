import { TextInput, Text, View, StyleSheet, TextInputProps } from "react-native";
import { borderRadius, colors, fontSize, spacing } from "../constants/theme";

interface InputProps extends TextInputProps {
  label: string;
}

export function Input({ label, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, style]} {...rest} />
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
  input: {
    height: 40,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    fontSize: fontSize.lg,
  },
 

});
