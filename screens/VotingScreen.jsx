import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
const candidates = [
  { id: '1', name: 'Candidate 1', image: 'https://via.placeholder.com/150', description: 'Description for Candidate 1' },
  { id: '2', name: 'Candidate 2', image: 'https://via.placeholder.com/150', description: 'Description for Candidate 2' },
  { id: '3', name: 'Candidate 3', image: 'https://via.placeholder.com/150', description: 'Description for Candidate 3' },
];

const Dropdown = ({ candidate, isVisible, onClose, onFingerprint }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.dropdown, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity onPress={onClose} style={styles.dropdownCloseButton}>
        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/fingerprint.png' }} style={styles.dropdownFingerprintIcon} />
      </TouchableOpacity>
      <Text style={styles.dropdownText}>{candidate.name}</Text>
      <Text style={styles.dropdownDescription}>{candidate.description}</Text>
      <TouchableOpacity style={styles.fingerprintButton} onPress={onFingerprint}>
        <Text style={styles.fingerprintButtonText}>Scan Fingerprint</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CandidateBox = ({ candidate, onVote }) => (
  <View style={styles.candidateBox}>
    <Text style={styles.candidateName}>{candidate.name}</Text>
    <Image source={{ uri: candidate.image }} style={styles.candidateImage} />
    <Text style={styles.description}>{candidate.description}</Text>
    <TouchableOpacity style={styles.voteButton} onPress={() => onVote(candidate)}>
      <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/fingerprint.png' }} style={styles.fingerprintIcon} />
      <Text style={styles.voteButtonText}>Vote</Text>
    </TouchableOpacity>
  </View>
);

const VotingScreen = () => {
  const navigation = useNavigation();
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleVote = (candidate) => {
    if (!hasVoted) {
      setVotes((previousVotes) => ({
        ...previousVotes,
        [candidate.name]: (previousVotes[candidate.name] || 0) + 1,
      }));
      setHasVoted(true);
    }
    setSelectedCandidate(candidate);
    setIsDropdownVisible(true);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  const handleFingerprintScan = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
      if (!hasHardware) {
        Alert.alert('Error', 'No biometric hardware found on this device.');
        return;
      }
  
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometric data enrolled on this device.');
        return;
      }
  
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your fingerprint to confirm your vote',
        fallbackLabel: 'Use PIN',
      });
  
      if (result.success) {
        console.log('Success', 'Fingerprint authentication successful!');
  
       
        const userPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
  
        if (!userPhoneNumber) {
          Alert.alert('Error', 'User phone number not found.');
          return;
        }
  
       
        const userResponse = await fetch(`${API_URL}/api/users/phone/${userPhoneNumber}`);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
        
          const userId = userData._id;
  
         
          const candidateData = {
            name: selectedCandidate.name,
            image: selectedCandidate.image,
            description: selectedCandidate.description,
            userId: userId, 
          };
          
  
        
          const response = await fetch(`${API_URL}/api/candidates`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidateData),
          });
  
          if (response.ok) {
            console.log('Candidate added successfully!');
            navigation.navigate('votingconfirm', { candidate: selectedCandidate });
          } else {
            Alert.alert('Error', 'Failed to add candidate.');
          }
        } else {
          Alert.alert('Error', 'User not found.');
        }
      } else {
        Alert.alert('Error', 'Fingerprint authentication failed.');
      }
    } catch (error) {
      console.error('Fingerprint authentication error:', error);
      Alert.alert('Error', 'Fingerprint authentication failed.');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        {candidates.map((candidate) => (
          <CandidateBox key={candidate.id} candidate={candidate} onVote={handleVote} />
        ))}
      </View>
      {selectedCandidate && <Dropdown candidate={selectedCandidate} isVisible={isDropdownVisible} onClose={closeDropdown} onFingerprint={handleFingerprintScan} />}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  container: {
    padding: 20,
  },
  candidateBox: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#9ED1FF',
    marginBottom: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  },
  description: {
    position: 'absolute',
    bottom: 120,
    color: '#fff',
    right: 40,
    textAlign: 'center',
  },
  candidateImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 210,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8CC4FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  fingerprintIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  voteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 40,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.2)',
  },
  dropdownCloseButton: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 10,
  },
  dropdownFingerprintIcon: {
    width: 50,
    height: 50,
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  fingerprintButton: {
    backgroundColor: '#8CC4FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  fingerprintButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VotingScreen;
