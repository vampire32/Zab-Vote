import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,Image } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useNavigation } from '@react-navigation/native';
import {  signInWithCredential } from 'firebase/auth';
import { auth, PhoneAuthProvider, firebaseConfig } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignupPage = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const handleSendOTP = async () => {
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(mobileNumber, recaptchaVerifier.current);
      setVerificationId(verificationId);
      console.log("OTP sent to your phone");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      console.log("Phone number verified successfully");
 
      await AsyncStorage.setItem('userPhoneNumber', mobileNumber);

      navigation.navigate('registeration');
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };
  

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />

      <View style={styles.headingContainer}>
        <Image
          source={require('../assets/images/otp-one-time.png')} // Replace with your image path
          style={styles.icon}
        />
        <Text style={styles.heading}>Enter Your Mobile Number</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          placeholderTextColor="#aaa"
        />
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {verificationId && (
        <View style={styles.otpDropdown}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            placeholderTextColor=""
          />
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#E6E6FA',
},
scrollContainer: {
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
headingContainer: {
  alignItems: 'center',
  marginBottom: 30,
},
icon: {
  width: 120, // Increased width
  height: 120, // Increased height
  marginBottom: 20,
},
heading: {
  fontSize: 26,
  fontFamily: 'Roboto-Bold',
  color: '#333',
},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#fff',
  borderColor: '#d3d3d3',
  borderWidth: 1,
  borderRadius: 30,
  marginVertical: 12,
  paddingLeft: 15,
},
input: {
  flex: 1,
  padding: 12,
  fontSize: 16,
  fontFamily: 'Roboto-Regular',
  color: '#000',
},
sendButton: {
  marginTop: 20,
  backgroundColor: '#4682B4',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
},
buttonText: {
  color: '#fff',
  fontSize: 18,
  fontFamily: 'Roboto-Medium',
  textAlign: 'center',
},
otpDropdown: {
  marginTop: 20,
  width: '100%',
  backgroundColor: '#f8f8f8',
  borderRadius: 20,
  padding: 25,
  borderWidth: 1,
  borderColor: '#ddd',
  alignItems: 'center',
},
verifyButton: {
  marginTop: 20,
  backgroundColor: '#4682B4',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
},
});

export default SignupPage;
