import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, Link } from "expo-router";
import { loginApi } from "@/lib/db";
import { t } from "@/lib/i18n";
import { useAuth } from "@/store/auth";
export default function LoginScreen() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password) {
      setError(t("login.validation"));
      return;
    }
    setIsSubmitting(true);
    try {
      await loginApi({ username: username.trim(), password });
      router.replace("/(dashboard)");
    } catch {
      setError(t("login.error"));
    } finally {
      setIsSubmitting(false);
    }
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
            <Text style={styles.subtitle}>{t("app.subtitle")}</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>{t("login.username_label")}</Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={username}
                onChangeText={setUsername}
                placeholder={t("login.username_placeholder")}
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>{t("login.password_label")}</Text>
                <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
                  {t("login.forgot")}
                </Link>
              </View>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    error ? styles.inputError : null,
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("login.password_placeholder")}
                  placeholderTextColor="#666"
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity
                  onPress={() => setShowPass(!showPass)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>{t("login.title")}</Text>
              )}
            </TouchableOpacity>
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
    marginBottom: 32,
  },
  brand: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00d4ff",
  },
  subtitle: {
    fontSize: 11,
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
    fontWeight: "600",
    color: "#e0e0e0",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotLink: {
    color: "#00d4ff",
  },
  input: {
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a4a",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeIcon: {
    fontSize: 10,
  },
  errorText: {
    color: "#ff4444",
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
  },
});
