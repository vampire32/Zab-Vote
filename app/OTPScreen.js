import React, { useState,useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Button ,Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function OTPScreen() {
    const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

 
useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    const otpCopy = [...otp];
    otpCopy[index] = value;
    setOtp(otpCopy);
  };

  const handleVerify = async() => {
    const enteredOtp = otp.join('');
    const phoneNumber=await AsyncStorage.getItem('phoneNumber');
    console.log(phoneNumber);
    console.log('Entered OTP:', enteredOtp);

    try {
      const response= await fetch('http://192.168.100.17:3000/api/verify-otp',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber:phoneNumber,
         otp:enteredOtp
        }),
      });
    
      if(response.ok){
        AsyncStorage.setItem('otp',enteredOtp);
        router.push('/(tabs)/MainScreen');
      }else{
        console.log(" verified faild otp");
      }
    } catch (error) {
      console.log("verified faild otp",error);
      
    }
   

  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      console.log('Resending OTP...');
    
    }
  };

  return (
    <View style={styles.container}>
   
   <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </Pressable>

      <Text style={styles.heading}>Almost there</Text>
      <Text style={styles.subtitle}>Please enter the 6-digit code sent to</Text>
      <Text style={styles.phoneNumber}>+1 84 372 9360</Text>


      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            style={styles.otpInput}
          />
        ))}
      </View>

    
      <TouchableOpacity
        style={[styles.verifyButton, otp.join('').length < 6 && styles.disabledButton]}
        onPress={handleVerify}
        disabled={otp.join('').length < 6}
      >
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

    
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
          <Text
            style={[
              styles.resendLink,
              resendTimer > 0 && { color: '#aaa' }, // Disable resend styling
            ]}
          >
            Resend
          </Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>
          {resendTimer > 0 ? ` request the new code in ${resendTimer} seconds` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4834D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  phoneNumber: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4834D4',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#4834D4',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#4834D4',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 12,
    color: '#666',
  },
});
