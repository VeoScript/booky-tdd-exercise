import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import tw from '@/styles/tailwind';

function ListSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  const skeletons = new Array(10).fill(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={tw`w-full`}>
      {skeletons.map((_, index) => (
        <Animated.View
          key={index}
          style={tw.style('h-12 mb-2 rounded-xl bg-default-gray', { opacity })}
        />
      ))}
    </View>
  );
}

export default ListSkeleton;
