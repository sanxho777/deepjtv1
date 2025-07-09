import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { X, Navigation, Volume2, VolumeX, RotateCcw, MapPin, Target, ArrowUp, ArrowRight, ArrowLeft, Compass, Zap, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface NavigationStep {
  instruction: string;
  distance: number;
  direction: 'straight' | 'left' | 'right';
  landmark?: string;
}

interface Navigation3DProps {
  visible: boolean;
  onClose: () => void;
  ball: {
    id: string;
    name: string;
    connected: boolean;
    distance: number;
    position: { x: number; y: number };
  } | null;
}

export default function Navigation3D({ visible, onClose, ball }: Navigation3DProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [compassHeading, setCompassHeading] = useState(0);
  const [pulseAnimation] = useState(new Animated.Value(1));

  const navigationSteps: NavigationStep[] = [
    {
      instruction: "Head northeast toward the fairway",
      distance: 45,
      direction: 'right',
      landmark: "Large oak tree on your right"
    },
    {
      instruction: "Continue straight past the sand trap",
      distance: 28,
      direction: 'straight',
      landmark: "Sand bunker on left side"
    },
    {
      instruction: "Turn slightly left toward the rough",
      distance: 15,
      direction: 'left',
      landmark: "Near the 150-yard marker"
    },
    {
      instruction: "Ball should be visible ahead",
      distance: 8,
      direction: 'straight',
      landmark: "In the light rough, near small bush"
    }
  ];

  useEffect(() => {
    if (isNavigating) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      return () => pulseLoop.stop();
    }
  }, [isNavigating]);

  useEffect(() => {
    // Simulate compass heading changes
    if (isNavigating) {
      const interval = setInterval(() => {
        setCompassHeading(prev => (prev + Math.random() * 10 - 5) % 360);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isNavigating]);

  const handleStartNavigation = () => {
    if (!ball?.connected) {
      Alert.alert(
        'Ball Not Connected', 
        'You need to connect to a golf ball before starting navigation. Please go to the Balls tab and connect to a ball first.',
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Go to Balls', onPress: () => Alert.alert('Navigation', 'This would navigate to the Balls tab') }
        ]
      );
      return;
    }
    
    setIsNavigating(true);
    setCurrentStep(0);
    setVoiceEnabled(true);
    Alert.alert('Navigation Started', 'Turn-by-turn navigation has begun. Follow the on-screen directions to find your ball.');
  };

  const handleNextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      if (voiceEnabled) {
        Alert.alert('Next Step', navigationSteps[currentStep + 1].instruction);
      }
    } else {
      handleFoundBall();
    }
  };

  const handleFoundBall = () => {
    setIsNavigating(false);
    setCurrentStep(0);
    Alert.alert(
      'Ball Found!', 
      'Congratulations! You\'ve successfully found your golf ball. The navigation session has ended.',
      [
        { text: 'Continue Playing', style: 'cancel' },
        { text: 'Mark Ball as Lost', style: 'destructive', onPress: () => Alert.alert('Ball Marked', 'Ball marked as lost in your game statistics') }
      ]
    );
    onClose();
  };

  const handleRecenter = () => {
    Alert.alert(
      'Recalibrating GPS', 
      'Updating your position...',
      [{ text: 'OK' }]
    );
    setTimeout(() => {
      Alert.alert('GPS Updated', 'Your position has been recalibrated successfully');
    }, 1000);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    Alert.alert(
      'Voice Navigation', 
      voiceEnabled ? 'Voice instructions have been disabled' : 'Voice instructions have been enabled'
    );
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'left': return ArrowLeft;
      case 'right': return ArrowRight;
      default: return ArrowUp;
    }
  };

  const renderCompass = () => (
    <View style={styles.compassContainer}>
      <View style={[styles.compass, { transform: [{ rotate: `${compassHeading}deg` }] }]}>
        <Compass color="#16a34a" size={32} />
      </View>
      <Text style={styles.compassText}>N</Text>
    </View>
  );

  const render3DMap = () => (
    <View style={styles.mapContainer}>
      <LinearGradient
        colors={['#4ade80', '#22c55e', '#16a34a']}
        style={styles.map3D}
      >
        {/* Terrain features */}
        <View style={[styles.terrain, styles.fairway]} />
        <View style={[styles.terrain, styles.rough]} />
        <View style={[styles.terrain, styles.sandTrap]} />
        <View style={[styles.terrain, styles.waterHazard]} />
        
        {/* Trees and landmarks */}
        <View style={[styles.landmark, styles.tree, { top: '20%', left: '70%' }]} />
        <View style={[styles.landmark, styles.tree, { top: '60%', right: '20%' }]} />
        <View style={[styles.landmark, styles.bush, { top: '80%', left: '60%' }]} />
        
        {/* Distance markers */}
        <View style={[styles.distanceMarker, { top: '40%', left: '50%' }]}>
          <Text style={styles.distanceText}>150</Text>
        </View>
        
        {/* Player position */}
        <View style={[styles.playerPosition, { bottom: '10%', left: '50%' }]}>
          <View style={styles.playerDot} />
          <View style={styles.playerDirection} />
        </View>
        
        {/* Ball position with pulse animation */}
        {ball && (
          <Animated.View 
            style={[
              styles.ballPosition, 
              { 
                top: `${ball.position.y}%`, 
                left: `${ball.position.x}%`,
                transform: [{ scale: pulseAnimation }]
              }
            ]}
          >
            <View style={styles.ballDot} />
            <View style={styles.ballGlow} />
          </Animated.View>
        )}
        
        {/* Navigation path */}
        {isNavigating && (
          <View style={styles.navigationPath}>
            <View style={[styles.pathSegment, { top: '85%', left: '50%', width: 40, height: 2 }]} />
            <View style={[styles.pathSegment, { top: '70%', left: '55%', width: 35, height: 2, transform: [{ rotate: '15deg' }] }]} />
            <View style={[styles.pathSegment, { top: '55%', left: '58%', width: 30, height: 2 }]} />
            <View style={[styles.pathSegment, { top: '40%', left: '60%', width: 25, height: 2, transform: [{ rotate: '-10deg' }] }]} />
          </View>
        )}
      </LinearGradient>
      
      {renderCompass()}
    </View>
  );

  const renderNavigationControls = () => (
    <View style={styles.controlsContainer}>
      {!isNavigating ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation}>
          <Navigation color="#ffffff" size={20} />
          <Text style={styles.startButtonText}>Start Navigation</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.navigationControls}>
          <View style={styles.stepInfo}>
            <View style={styles.stepHeader}>
              <View style={styles.directionIcon}>
                {React.createElement(getDirectionIcon(navigationSteps[currentStep]?.direction), {
                  color: '#16a34a',
                  size: 24
                })}
              </View>
              <Text style={styles.stepDistance}>
                {navigationSteps[currentStep]?.distance}m
              </Text>
            </View>
            <Text style={styles.stepInstruction}>
              {navigationSteps[currentStep]?.instruction}
            </Text>
            {navigationSteps[currentStep]?.landmark && (
              <Text style={styles.stepLandmark}>
                📍 {navigationSteps[currentStep]?.landmark}
              </Text>
            )}
          </View>
          
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton} onPress={handleRecenter}>
              <RotateCcw color="#6b7280" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navButton} onPress={toggleVoice}>
              {voiceEnabled ? (
                <Volume2 color="#16a34a" size={20} />
              ) : (
                <VolumeX color="#6b7280" size={20} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              {currentStep === navigationSteps.length - 1 ? (
                <>
                  <CheckCircle color="#ffffff" size={16} />
                  <Text style={styles.nextButtonText}>Found Ball</Text>
                </>
              ) : (
                <>
                  <ArrowUp color="#ffffff" size={16} />
                  <Text style={styles.nextButtonText}>Next Step</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Ball Navigation</Text>
            <Text style={styles.subtitle}>
              {ball ? `${ball.name} • ${ball.distance}m away` : 'No ball connected'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>

        {render3DMap()}
        
        <View style={styles.ballInfo}>
          <View style={styles.ballInfoItem}>
            <Target color="#16a34a" size={16} />
            <Text style={styles.ballInfoText}>
              {ball?.name || 'No ball selected'}
            </Text>
          </View>
          <View style={styles.ballInfoItem}>
            <Zap color="#3b82f6" size={16} />
            <Text style={styles.ballInfoText}>
              {ball?.connected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
          <View style={styles.ballInfoItem}>
            <MapPin color="#f59e0b" size={16} />
            <Text style={styles.ballInfoText}>
              {ball?.distance || 0}m away
            </Text>
          </View>
        </View>

        {renderNavigationControls()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map3D: {
    flex: 1,
    position: 'relative',
  },
  terrain: {
    position: 'absolute',
    borderRadius: 8,
  },
  fairway: {
    width: '60%',
    height: '40%',
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    top: '30%',
    left: '20%',
  },
  rough: {
    width: '80%',
    height: '20%',
    backgroundColor: 'rgba(34, 197, 94, 0.6)',
    top: '70%',
    left: '10%',
  },
  sandTrap: {
    width: '15%',
    height: '10%',
    backgroundColor: 'rgba(251, 191, 36, 0.8)',
    top: '45%',
    left: '15%',
    borderRadius: 20,
  },
  waterHazard: {
    width: '25%',
    height: '15%',
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    top: '20%',
    right: '15%',
    borderRadius: 30,
  },
  landmark: {
    position: 'absolute',
    borderRadius: 50,
  },
  tree: {
    width: 12,
    height: 12,
    backgroundColor: 'rgba(34, 139, 34, 0.8)',
  },
  bush: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(107, 142, 35, 0.8)',
  },
  distanceMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  playerPosition: {
    position: 'absolute',
    alignItems: 'center',
  },
  playerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  playerDirection: {
    width: 2,
    height: 20,
    backgroundColor: '#3b82f6',
    marginTop: -2,
  },
  ballPosition: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  ballGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(22, 163, 74, 0.3)',
  },
  navigationPath: {
    position: 'absolute',
  },
  pathSegment: {
    position: 'absolute',
    backgroundColor: 'rgba(22, 163, 74, 0.8)',
    borderRadius: 1,
  },
  compassContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'center',
  },
  compass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  compassText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: 4,
  },
  ballInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  ballInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ballInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  controlsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  navigationControls: {
    gap: 16,
  },
  stepInfo: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  directionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDistance: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
  },
  stepInstruction: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  stepLandmark: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});