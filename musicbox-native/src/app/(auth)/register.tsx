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
import { create } from "@/lib/db";
import { t } from "@/lib/i18n";
import { useAuth } from "@/store/auth";
export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRegister = async () => {
    setError("");
    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(t("register.all_required"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("register.invalid_email"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("register.password_mismatch"));
      return;
    }
    const token = useAuth.getState().token;
    if (!token) {
      setError(t("register.no_token"));
      return;
    }
    setIsSubmitting(true);
    try {
      await create("users", {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
      });
      Alert.alert(t("register.success_title"), t("register.success_text"));
      router.push("/(dashboard)/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.error"));
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
            <Text style={styles.subtitle}>{t("register.title")}</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>{t("register.full_name_label")}</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder={t("register.full_name_placeholder")}
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{t("register.username_label")}</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder={t("register.username_placeholder")}
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{t("register.email_label")}</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t("register.email_placeholder")}
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{t("login.password_label")}</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
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
            <View style={styles.field}>
              <Text style={styles.label}>{t("password.confirm")}</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t("login.password_placeholder")}
                  placeholderTextColor="#666"
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirm ? "🙈" : "👁"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>{t("register.submit")}</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t("login.remember")}{" "}
              <Link href="/(auth)/login" style={styles.footerLink}>
                {t("login.login_here")}
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
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  input: {
    backgroundColor: "#12121e",
    borderWidth: 1,
    borderColor: "#2a2a4a",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 8,
    color: "#fff",
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
    marginTop: 20,
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
