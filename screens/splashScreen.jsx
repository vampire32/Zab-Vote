import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const circleAnim = useRef(new Animated.Value(-150)).current; // Start position off-screen
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('account'); // Navigate to 'account' screen after 12 seconds
    }, 3000);

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    // Drop up animation
    Animated.timing(circleAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, circleAnim]);
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(
      Svg,
      { height: "100%", width: "100%", style: StyleSheet.absoluteFill },
      React.createElement(
        Defs,
        null,
        React.createElement(
          LinearGradient,
          { id: "grad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
          React.createElement(Stop, { offset: "0%", stopColor: "#1b264f" }),
          React.createElement(Stop, { offset: "100%", stopColor: "#274690" })
        )
      ),
      React.createElement(Rect, {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        fill: "url(#grad)",
      })
    ),
    React.createElement(Text, { style: styles.text }, "ZabVote"),
    React.createElement(
      Animated.View,
      { style: [styles.innerContainer, { opacity: fadeAnim }] },
      React.createElement(Image, {
        source: require('../assets/images/szabist.png'),
        style: styles.logo,
      }),
      React.createElement(
        Text,
        { style: styles.description },
        "Your one-stop solution for seamless voting experiences.\nBiometric Two-Factor Authentication Voting\nApp for SZABIST University Student Council Elections"
      )
    ),
    React.createElement(Animated.View, {
      style: [styles.circle, { transform: [{ translateY: circleAnim }] }],
    })
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 270,
    height: 290,
    marginVertical: 20,
    borderRadius: 77,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  circle: {
    position: 'absolute',
    bottom: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#1b264f',
    opacity: 0.4,
  },
});
export default SplashScreen;