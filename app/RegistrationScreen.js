import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable,Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegistrationScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    regNumber: '',
    phoneNumber: ''
  });

  const otpHandle=async(phoneNumber)=>{

    try {
      const response=await fetch('http://192.168.100.17:3000/api/request-otp',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         phoneNumber:phoneNumber
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        Alert.alert('Success', 'OTO Send');
       
        router.push('/OTPScreen');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.msg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      
    }

  }

  const handleRegister = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.regNumber ||
      !formData.phoneNumber
    ) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.100.17:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          rollno: formData.regNumber,
          phoneno: formData.phoneNumber,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        otpHandle(data.phoneno);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.msg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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

    
      <Text style={styles.title}>Create account</Text>

    
      <View style={styles.formSection}>
      
        <TextInput
          style={styles.input}
          placeholder="First name"
          value={formData.firstName}
          onChangeText={(text) => setFormData({...formData, firstName: text})}
          placeholderTextColor="#666"
        />

    
        <TextInput
          style={styles.input}
          placeholder="last name"
          value={formData.lastName}
          onChangeText={(text) => setFormData({...formData, lastName: text})}
          placeholderTextColor="#666"
        />

      
        <TextInput
          style={styles.input}
          placeholder="Enter Your Reg Number"
          value={formData.regNumber}
          onChangeText={(text) => setFormData({...formData, regNumber: text})}
          placeholderTextColor="#666"
        />

       
        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+1</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
            keyboardType="phone-pad"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.enterButton}
        onPress={handleRegister}
      >
        <Text style={styles.enterButtonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 120,
    marginBottom: 30,
  },
  formSection: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    width: 60,
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 16,
  },
  enterButton: {
    backgroundColor: '#4834D4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});