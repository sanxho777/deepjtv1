import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { X, Navigation, Compass, MapPin, Target, Zap } from 'lucide-react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei/native';
import * as Location from 'expo-location';

interface Navigation3DProps {
  visible: boolean;
  onClose: () => void;
  ball: {
    id: string;
    name: string;
    connected: boolean;
    distance: number;
    position: { x: number; y: number; z: number };
  } | null;
}

function UserMarker({ position }: { position: [number, number, number] }) {
  const mesh = useRef<any>();
  return (
    <mesh ref={mesh} position={position}>
      <coneGeometry args={[0.5, 1, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

function BallMarker({ position }: { position: [number, number, number] }) {
  const mesh = useRef<any>();
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta;
    }
  });
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
}

export default function Navigation3D({ visible, onClose, ball }: Navigation3DProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in your device settings.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setUserPosition([location.coords.longitude, 0, location.coords.latitude]);
    })();
  }, []);

  const handleStartNavigation = () => {
    if (!ball?.connected) {
      Alert.alert('Ball Not Connected', 'Please connect to a ball first.');
      return;
    }
    Alert.alert('Navigation Started', `Navigating to ${ball.name}.`);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Ball Navigation</Text>
            <Text style={styles.subtitle}>{ball ? `${ball.name} • ${ball.distance}m away` : 'No ball selected'}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>

        <Canvas style={styles.canvas}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <PerspectiveCamera makeDefault position={[0, 5, 5]} />
          <OrbitControls />
          <Ground />
          <UserMarker position={userPosition} />
          {ball && ball.connected && <BallMarker position={[ball.position.x, ball.position.y, ball.position.z]} />}
        </Canvas>

        <View style={styles.bottomBar}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Target color="#16a34a" size={16} />
              <Text style={styles.infoText}>{ball?.name || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Zap color={ball?.connected ? '#3b82f6' : '#ef4444'} size={16} />
              <Text style={styles.infoText}>{ball?.connected ? 'Connected' : 'Disconnected'}</Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin color="#f59e0b" size={16} />
              <Text style={styles.infoText}>{ball?.distance || 0}m away</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.navButton} onPress={handleStartNavigation}>
            <Navigation color="#ffffff" size={20} />
            <Text style={styles.navButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  canvas: {
    flex: 1,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#374151',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
