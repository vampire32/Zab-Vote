import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const Form = () => {
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedRollNo = await AsyncStorage.getItem('userRollNo');
        if (storedRollNo) {
          setRollNo(storedRollNo);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };
    checkUserSession();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentname: studentName,
          rollno: rollNo,
        }),
      });

      if (response.ok) {
        navigation.navigate('votingscreen');
      } else {
        Alert.alert('Error', 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Could not submit the form. Please try again.');
    }
  };

  const handleFingerprintScan = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Error', 'Fingerprint scanner not available on this device.');
      return;
    }
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Error', 'No fingerprints enrolled.');
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Fingerprint',
    });
    if (result.success) {
      Alert.alert('Success', 'Fingerprint authenticated successfully!');
      handleSubmit();
    } else {
      Alert.alert('Error', 'Fingerprint authentication failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Student Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter student name"
        value={studentName}
        onChangeText={setStudentName}
      />
      <Text style={styles.label}>Roll No</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter roll number"
        value={rollNo}
        onChangeText={setRollNo}
      />

      {/* Fingerprint Scan Option */}
      <Pressable style={styles.fingerprintButton} onPress={handleFingerprintScan}>
        <Image
          source={require('../assets/images/fingerprint.png')} // Make sure to include a fingerprint icon in the assets folder
          style={styles.fingerprintIcon}
        />
        <Text style={styles.fingerprintText}>Scan Fingerprint</Text>
      </Pressable>
      
      <Pressable style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.cta}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#1B264F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  cta: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  fingerprintButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  fingerprintIcon: {
    width: 50,
    height: 50,
  },
  fingerprintText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3795BD',
  },
});

export default Form;
