import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const VoteConfirmationPage = () => {
  const route = useRoute();
  const { candidate } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.bubbleWrapper}>
          <View style={styles.bubbleDivider} />
          <View style={styles.bubbleDivider} />
        </View>

        {candidate ? (
          <>
            <Image
              source={{ uri: candidate.image }}
              style={styles.candidateImage}
            />
            <Text style={styles.name}>{candidate.name}</Text>
            <Text style={styles.description}>{candidate.description}</Text>
          </>
        ) : (
          <Text style={styles.errorText}>No candidate information available.</Text>
        )}

        <View style={[styles.bubbleWrapper, styles.bubbleBottomWrapper]}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.bubbleDivider} />
          ))}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.heading}>
          You have successfully voted for the following candidate:
        </Text>
        <Image
          source={{
            uri: 'https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-green-check-mark-icon-flat-style-png-image_1986021.jpg',
          }}
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9ED1FF',
  },
  topSection: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  bottomSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#9ED1FF',
  },
  image: {
    width: width * 0.25, // 25% of screen width
    height: width * 0.25,
    borderRadius: width * 0.125, // half of the width to make it circular
    marginBottom: 16,
  },
  candidateImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2, // half of the width to make it circular
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
  },
  bubbleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    top: -25,
    zIndex: 1,
  },
  bubbleBottomWrapper: {
    top: 'auto', // Reset top to auto
    bottom: -25, // Place at the bottom of the topSection
  },
  bubbleDivider: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25, // Half of the width/height to make it circular
  },
});

export default VoteConfirmationPage;
