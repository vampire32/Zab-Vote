import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MainScreen() {
  const [search, setSearch] = useState('');
  const candidates = [
    {
      id: '1',
      name: 'Mauro Pires',
      party: 'Frelimo',
      image: 'https://via.placeholder.com/100', // Placeholder image
    },
    {
      id: '2',
      name: 'Mauro Pires',
      party: 'Renamo',
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      name: 'Mauro Pires',
      party: 'MDM',
      image: 'https://via.placeholder.com/100',
    },
  ];




  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder profile image
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>Luis Milice</Text>
          <Text style={styles.profileRole}>voter</Text>
        </View>
      </View>



    
      <TextInput
        style={styles.searchBar}
        placeholder="Search candidates ..."
        value={search}
        onChangeText={(text) => setSearch(text)}
      />

    
      <Text style={styles.sectionTitle}>Voting candidates</Text>
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.candidateCard}>
            <Image source={{ uri: item.image }} style={styles.candidateImage} />
            <View style={styles.candidateDetails}>
              <Text style={styles.candidateName}>{item.name}</Text>
              <Text style={styles.candidateParty}>{item.party}</Text>
            </View>
            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>view profile</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
  timerContainer: {
    backgroundColor: '#4834D4',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  countdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#fff',
  },
  searchBar: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  candidateImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  candidateDetails: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  candidateParty: {
    fontSize: 14,
    color: '#666',
  },
  viewProfileButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4834D4',
    borderRadius: 5,
  },
  viewProfileText: {
    color: '#4834D4',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
