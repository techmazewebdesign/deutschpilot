import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from './theme';
export function LoadingScreen({ message = 'Dein Lernweg wird vorbereitet …', compact = false }: { message?: string; compact?: boolean }) {
  const { C } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (reduced) { pulse.setValue(1); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.07, duration: 750, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: true }),
    ]));
    animation.start(); return () => animation.stop();
  }, [pulse, reduced]);
  return <View accessibilityRole="progressbar" accessibilityLabel={message} style={{ flex: compact ? undefined : 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: compact ? 16 : 32, backgroundColor: C.panel }}>
    <Animated.View style={{ transform: [{ scale: pulse }] }}><Image source={require('../assets/logo.png')} accessibilityLabel="DeutschPilot Logo" style={{ width: compact ? 48 : 96, height: compact ? 48 : 96, borderRadius: 20 }} /></Animated.View>
    <Text style={{ color: C.white, fontWeight: '800', fontSize: compact ? 15 : 22 }}>DEUTSCHPILOT</Text>
    <ActivityIndicator color={C.gold} /><Text style={{ color: C.muted, textAlign: 'center' }}>{message}</Text>
  </View>;
}
