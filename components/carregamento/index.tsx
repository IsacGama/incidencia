import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LoadingSpinner = () => {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const rotation3 = useSharedValue(0);
  const glowOpacity = useSharedValue(1);

  useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1
    );
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 2000, easing: Easing.linear }),
      -1
    );
    rotation3.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1
    );
    glowOpacity.value = withRepeat(
      withTiming(0.2, { duration: 800, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation1.value}deg` }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation2.value}deg` }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation3.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Primeiro arco + luz */}
      <Animated.View style={[animatedStyle1, { position: 'absolute' }]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Path
            d="M30,60 A30,30 0 0,1 90,60"
            stroke="blue"
            strokeWidth="5"
            fill="transparent"
            strokeLinecap="round"
          />
          <Animated.View style={glowStyle}>
            <Circle
              cx="90"
              cy="60"
              r="5"
              fill="blue"
            />
          </Animated.View>
        </Svg>
      </Animated.View>

      {/* Segundo arco + luz */}
      <Animated.View style={[animatedStyle2, { position: 'absolute' }]}>
        <Svg width={140} height={140} viewBox="0 0 140 140">
          <Path
            d="M25,70 A45,45 0 0,1 115,70"
            stroke="red"
            strokeWidth="5"
            fill="transparent"
            strokeLinecap="round"
          />
          <Animated.View style={glowStyle}>
            <Circle
              cx="115"
              cy="70"
              r="5"
              fill="red"
            />
          </Animated.View>
        </Svg>
      </Animated.View>

      {/* Terceiro arco + luz */}
      <Animated.View style={[animatedStyle3, { position: 'absolute' }]}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Path
            d="M20,80 A55,55 0 0,1 140,80"
            stroke="green"
            strokeWidth="5"
            fill="transparent"
            strokeLinecap="round"
          />
          <Animated.View style={glowStyle}>
            <Circle
              cx="140"
              cy="80"
              r="5"
              fill="green"
            />
          </Animated.View>
        </Svg>
      </Animated.View>
    </View>
  );
};

export default LoadingSpinner;
