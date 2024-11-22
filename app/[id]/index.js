import { useLocalSearchParams } from 'expo-router';
import React,{useState} from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ConfirmationModal from '../components/ConfirmationModal';
export default function CandidateProfile() {
  const router = useRouter();
  const { candidate } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const candidateData = JSON.parse(candidate);
  const handleConfirm = () => {
    // Handle confirmation action
    setModalVisible(false);
  };
  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        <Image
          source={{ uri: candidateData.image || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{candidateData.name}</Text>
         
        </View>
      </View>

      <TouchableOpacity style={styles.voteButton}  onPress={() => setModalVisible(true)} >
        <Text style={styles.voteText}>Vote Now</Text>
      </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Description</Text>
          <Text style={styles.contentText}>{candidateData.description}</Text>
        </View>
        <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  voteButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  voteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: 'gray',
  },
  followButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  followText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
