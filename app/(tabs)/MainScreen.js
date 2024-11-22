import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const [search, setSearch] = useState("");
  const [username, setusername] = useState("");
  const [userData, setuserData] = useState(false);
  const [candidate, setCandidate] = useState([]);
  const router = useRouter();
  const candidates = [
    {
      id: "1",
      name: "Mauro Pires",
      party: "Frelimo",
      image: "https://via.placeholder.com/100", // Placeholder image
    },
    {
      id: "2",
      name: "Mauro Pires",
      party: "Renamo",
      image: "https://via.placeholder.com/100",
    },
    {
      id: "3",
      name: "Mauro Pires",
      party: "MDM",
      image: "https://via.placeholder.com/100",
    },
  ];

  const currentUser = async () => {
    const currentuser = await AsyncStorage.getItem("fingerprint");
    try {
      const response = await fetch(
        `http://192.168.100.17:3000/api/users/fingerprint/${currentuser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const user_data = await response.json();
        setuserData(true);
        setusername(user_data.firstname + " " + user_data.lastname);
      }
    } catch (error) {}
  };
  const getAllCandidate = async () => {
    try {
      const response = await fetch(`http://192.168.100.17:3000/api/candidates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const candidateData = await response.json(); // Parse JSON properly
        setCandidate(candidateData); // Update state
      } else {
        console.error("Failed to fetch candidates:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };
  

  useEffect(() => {
    currentUser();
    getAllCandidate();
  }, []);


  const handleProfilePress = (item) => {
    router.push({
      pathname: `/${item.id}`,
      params: {
        candidate: JSON.stringify(item)
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      {userData ? (
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileRole}>voter</Text>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Luis Milice</Text>
            <Text style={styles.profileRole}>voter</Text>
          </View>
        </View>
      )}

      <TextInput
        style={styles.searchBar}
        placeholder="Search candidates ..."
        value={search}
        onChangeText={(text) => setSearch(text)}
      />

      <Text style={styles.sectionTitle}>Voting candidates</Text>
      <FlatList
  data={candidate}
  keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
  renderItem={({ item }) => (
    <View style={styles.candidateCard}>
      <Image
        source={{
          uri: item.image || "https://via.placeholder.com/100",
        }}
        style={styles.candidateImage}
      />
      <View style={styles.candidateDetails}>
        <Text style={styles.candidateName}>{item.name || "Unknown Candidate"}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={() => handleProfilePress(item)}
      >
        <Text style={styles.viewProfileText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={
    <Text style={styles.emptyListText}>No candidates available.</Text>
  }
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 14,
    color: "#666",
  },
  timerContainer: {
    backgroundColor: "#4834D4",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  countdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  countdownLabel: {
    fontSize: 12,
    color: "#fff",
  },
  searchBar: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  candidateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
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
    fontWeight: "bold",
  },
  candidateParty: {
    fontSize: 14,
    color: "#666",
  },
  viewProfileButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#4834D4",
    borderRadius: 5,
  },
  viewProfileText: {
    color: "#4834D4",
    fontSize: 12,
    fontWeight: "bold",
  },
});
