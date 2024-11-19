import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();

  const [regNumber, setRegNumber] = useState("");

  const [isFingerPrintSupported, setIsFingerPrintSupported] = useState(false);
  const [fingerprintHash, setFingerprintHash] = useState(null);

  useEffect(() => {
    checkFingerPrintSupport();
  
  }, []);
  const generateFingerprintHash = async () => {
    try {
      const hardware = await LocalAuthentication.getEnrolledLevelAsync();
      const deviceId = await Application.androidId;
      const enrolledBiometrics = await LocalAuthentication.isEnrolledAsync();

      const uniqueString = `${deviceId}-${hardware}-${enrolledBiometrics}-${Date.now()}`;

      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        uniqueString
      );

      return hash;
    } catch (error) {
      console.error("Error generating fingerprint hash:", error);
      return null;
    }
  };

  const checkFingerPrintSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert(
          "Fingerprint Not Supported",
          "Your device does not support fingerprint authentication."
        );
        return;
      }

      const enrolledTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isFingerPrintAvailable = enrolledTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      );

      setIsFingerPrintSupported(isFingerPrintAvailable);

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert(
          "Fingerprint Not Set Up",
          "Please register at least one fingerprint in your device settings."
        );
        return;
      }

      // Check for fingerprint changes
      const newHash = await generateFingerprintHash();
      const storedHash = await AsyncStorage.getItem("fingerprintHash");

      // if (storedHash && newHash !== storedHash) {
      //   Alert.alert(
      //     "Fingerprint Changed",
      //     "Detected changes in registered fingerprints. Please re-authenticate.",
      //     [
      //       {
      //         text: "Cancel",
      //         style: "cancel",
      //       },
      //       {
      //         text: "Re-authenticate",
      //         onPress: () => registerNewFingerprint(newHash),
      //       },
      //     ]
      //   );
      // }


    } catch (error) {
      console.error("Error checking fingerprint support:", error);
    }
  };

  const registerNewFingerprint = async (newHash) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify your new fingerprint",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
        requireConfirmation: false,
        authenticationType: LocalAuthentication.AuthenticationType.FINGERPRINT,
      });

      if (result.success) {
        // Store new fingerprint hash
        await AsyncStorage.setItem("fingerprintHash", newHash);
        setFingerprintHash(newHash);

        // Store timestamp of registration
        const timestamp = new Date().toISOString();
        await AsyncStorage.setItem("fingerprintRegisteredAt", timestamp);

        // Store additional info if needed
        const fingerprintInfo = {
          hash: newHash,
          registeredAt: timestamp,
          deviceId: await Application.androidId,
          // Add any other relevant info
        };

        await AsyncStorage.setItem(
          "fingerprintInfo",
          JSON.stringify(fingerprintInfo)
        );

        await updateFingerprintOnServer(fingerprintInfo);

        Alert.alert("Success", "New fingerprint registered successfully!");
      }
    } catch (error) {
      console.error("Error registering new fingerprint:", error);
      Alert.alert(
        "Registration Failed",
        "Failed to register new fingerprint. Please try again."
      );
    }
  };

  const updateFingerprintOnServer = async (fingerprintInfo) => {
    try {
      console.log("Fingerprint info updated on server", fingerprintInfo);
    } catch (error) {
      console.error("Error updating fingerprint on server:", error);
    }
  };

  const handleFingerPrintAuth = async () => {
    try {
     
      const currentHash = await generateFingerprintHash();

      // if (fingerprintHash && currentHash !== fingerprintHash) {
      //   Alert.alert(
      //     "Fingerprint Changed",
      //     "Detected changes in registered fingerprints. Please re-authenticate.",
      //     [
      //       {
      //         text: "Cancel",
      //         style: "cancel",
      //       },
      //       {
      //         text: "Re-authenticate",
      //         onPress: () => registerNewFingerprint(currentHash),
      //       },
      //     ]
      //   );
      //   return;
      // }
 

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan your fingerprint to login",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
        fallbackLabel: "Use Password Instead",
        requireConfirmation: false,
        authenticationType: LocalAuthentication.AuthenticationType.FINGERPRINT,
      });

      if (result.success) {
        console.log("Fingerprint authentication successful");
        console.log("Authenticated Fingerprint ID (Hash):", currentHash);

        const timestamp = new Date().toISOString();
        await AsyncStorage.setItem("fingerprintLastUsed", timestamp);

        router.push("/OTPScreen");
      } else if (result.error === "user_cancel") {
        console.log("User cancelled fingerprint authentication");
      } else {
        Alert.alert(
          "Authentication Failed",
          "Fingerprint was not recognized. Please try again."
        );
      }
    } catch (error) {
      console.error("Fingerprint authentication error:", error);
      Alert.alert(
        "Authentication Error",
        "There was a problem with fingerprint authentication."
      );
    }
  };
  const handleEnterPress = async () => {
    try {
      const storedHash = await AsyncStorage.getItem("fingerprintHash");
  
      if (!storedHash) {
 
        const newHash = await generateFingerprintHash();
  
        if (newHash) {
    
          await AsyncStorage.setItem("fingerprintHash", newHash);
          Alert.alert(
            "Fingerprint Registered",
            "Your fingerprint has been registered. You can now use it to log in."
          );
        } else {
        
          Alert.alert(
            "Error",
            "Unable to generate fingerprint hash. Please try again."
          );
          return;
        }
      }
  
    
      router.push("/OTPScreen");
    } catch (error) {
      console.error("Error during Enter button press:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require("../assets/VoteLoge.png")} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to Votley</Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Reg Number"
            value={regNumber}
            onChangeText={setRegNumber}
          />
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleEnterPress}>
          <Text style={styles.loginButtonText}>Enter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push("/RegistrationScreen")}
        >
          <Text style={styles.createAccountText}>Create account</Text>
        </TouchableOpacity>

        {isFingerPrintSupported && (
          <View style={styles.fingerprintContainer}>
            <Text style={styles.orText}>or</Text>
            <Pressable
              style={styles.fingerprintButton}
              onPress={handleFingerPrintAuth}
            >
              <Ionicons name="finger-print-outline" size={32} color="#4834D4" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  topSection: {
    alignItems: "center",
    marginTop: "20%",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    tintColor: "#4834D4", // Adjust this color to match your brand color
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
  },
  inputSection: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  inputIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4834D4",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#4834D4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: "#4834D4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  createAccountText: {
    color: "#4834D4",
    fontSize: 16,
    fontWeight: "600",
  },
  fingerprintContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  orText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 15,
  },
  fingerprintButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
