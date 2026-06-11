import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, Link } from "expo-router";
import { t } from "@/lib/i18n";
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = () => {
    setError("");
    if (!email.trim()) {
      setError(t("forgot.email_required"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("forgot.invalid_email"));
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/(auth)/login");
    }, 1000);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.brand}>Sonance</Text>
            <Text style={styles.subtitle}>{t("forgot.title")}</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>{t("forgot.email_label")}</Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder={t("forgot.email_placeholder")}
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>{t("forgot.submit")}</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t("forgot.remember")}{" "}
              <Link href="/(auth)/login" style={styles.footerLink}>
                {t("forgot.login_link")}
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00d4ff",
  },
  subtitle: {
    fontSize: 9,
    color: "#666",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 8,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  input: {
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a4a",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 8,
    color: "#fff",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 9,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#00d4ff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#2a2a4a",
    paddingTop: 16,
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#666",
  },
  footerLink: {
    color: "#00d4ff",
    fontWeight: "600",
  },
});
