import React from 'react'
import { Text, View,StyleSheet,Image, Pressable } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
;
const Profile = () => {
  const logout=()=>{
AsyncStorage.removeItem('phoneNumber');
AsyncStorage.removeItem('fingerprint');
AsyncStorage.removeItem('otp');

  }
  return (
   
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
    
        <View>
          <Text style={styles.profileName}>Luis Milice</Text>
          <Text style={styles.profileRole}>voter</Text>
        </View>
      </View>
 
      <View style={styles.logout}>
        <View style={styles.iconsBackground}>
        <MaterialIcons name="logout" size={40} color="black" />
        </View>
        <Pressable onPress={logout} >
        <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
        
      </View>
      </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 10,
    marginTop:30,
    marginLeft:20,
  },
  logoutText: {
   
    fontSize: 32, // Adjust font size as needed
    color: '#4834D4', // Match color of the text with the icon
  },
  iconsBackground: {
    width: 60, // Fixed width
    height: 60, // Fixed height
    borderRadius: 30, // Half of width/height to make it circular
    backgroundColor: '#F5F5F5', // Light gray background
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
  },
});
export default Profile