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
import { fetchText } from "react-native-svg";

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

     
   
     

   

    } catch (error) {
      console.error("Error checking fingerprint support:", error);
    }
  };


  const handleFingerPrintAuth = async () => {
    try {
     
      const currentHash = await AsyncStorage.getItem("fingerprint");

   
 

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan your fingerprint to login",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
        fallbackLabel: "Use Password Instead",
        requireConfirmation: false,
        authenticationType: LocalAuthentication.AuthenticationType.FINGERPRINT,
      });

      if (result.success) {
        const response = await fetch(
          `http://192.168.100.17:3000/api/users/fingerprint/${currentHash}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if(response.ok){
          router.push("/OTPScreen");
        }else{
          Alert.alert(
            "Authentication Failed",
            "Fingerprint Firstly register your device by login trough the form"
          );
        }
    
       
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
      //  AsyncStorage.removeItem('fingerprint');
      const storedHash = await AsyncStorage.getItem("fingerprint");
  
      // If no stored fingerprint exists, proceed to generate a new one
      if (!storedHash) {
        console.log("No stored fingerprint found. Generating a new one...");
        const newHash = await generateFingerprintHash();
  
        if (!newHash) {
          Alert.alert("Error", "Unable to generate fingerprint hash. Please try again.");
          return;
        }
  
        // Send the new fingerprint hash to the server and associate it with the user
        const registerResponse = await fetch(`http://192.168.100.17:3000/api/users/${regNumber}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fingerprint: newHash }),
        });
  
        if (!registerResponse.ok) {
          const errorData = await registerResponse.json();
          console.error("Error during registration:", errorData);
          Alert.alert("Error", errorData.msg || "Failed to register fingerprint. Please try again.");
          return;
        }
  
       
        const registerResponseText = await registerResponse.text();
        const registerData = JSON.parse(registerResponseText);
        const phoneNumber = registerData.user.phoneno;
       
  
        // Save the new fingerprint hash locally
        await AsyncStorage.setItem("fingerprint", newHash);
  
        Alert.alert(
          "Fingerprint Registered",
          "Your device fingerprint has been registered. You can now use it to log in."
        );
  
        // Send an OTP request using the retrieved phone number
        const otpResponse = await fetch('http://192.168.100.17:3000/api/request-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber }),
        });
  
        if (!otpResponse.ok) {
          const otpErrorData = await otpResponse.json();
          console.error("Error during OTP request:", otpErrorData);
          Alert.alert("Error", otpErrorData.msg || "Failed to send OTP. Please try again.");
          return;
        }
  
        // OTP sent successfully, navigate to the OTP screen
        const otpData = await otpResponse.json();
        console.log("OTP Response:", otpData);
  
        await AsyncStorage.setItem("phoneNumber", phoneNumber);
  
        Alert.alert("Success", "OTP sent successfully!");
        router.push("/OTPScreen");
      } else {
        console.log("Stored fingerprint hash found:", storedHash);
      }
    } catch (error) {
      console.error("Error during Enter button press:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
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

        <TouchableOpacity style={styles.loginButton} onPress={()=>{
          handleEnterPress()
        }}>
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
