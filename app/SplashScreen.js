import React, { useEffect } from "react";
import { View, Text, StyleSheet,Image} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function SplashScreen() {
  const router = useRouter();
  const getPhoneNumber=async()=>{
    
    const phoneNumber= await AsyncStorage.getItem('fingerprint');
    const otp=await AsyncStorage.getItem('otp');
    if(!phoneNumber && !otp){
      router.push("/LoginScreen");
    }else{
      router.push('/(tabs)/MainScreen');
    }
  }
  useEffect(() => {
    
    const timer = setTimeout(() => {
      // router.push("/LoginScreen");
      getPhoneNumber(); 
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <View style={styles.container}>

    <View style={styles.logoContainer}>

      <Image
        source={require('../assets/VoteLoge.png')} 
        style={styles.logo}
      />
 
      <Text style={styles.appName}>Zab Vote</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    tintColor: '#4834D4', // Adjust this color to match your brand color
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4834D4', // Matching the logo color
    marginTop: 8,
  },
});
