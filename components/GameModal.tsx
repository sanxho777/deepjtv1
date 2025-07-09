import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { X, MapPin, Users, Calendar, Clock, Trophy, Target } from 'lucide-react-native';

interface GameModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGame: (gameData: any) => void;
}

export default function GameModal({ visible, onClose, onCreateGame }: GameModalProps) {
  const [gameType, setGameType] = useState<'practice' | 'tournament' | 'casual'>('practice');
  const [courseName, setCourseName] = useState('');
  const [players, setPlayers] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [holes, setHoles] = useState('18');

  const handleCreateGame = () => {
    if (!courseName.trim()) {
      Alert.alert('Error', 'Please enter a course name');
      return;
    }

    const gameData = {
      id: Date.now().toString(),
      course: courseName.trim(),
      date,
      players: parseInt(players),
      holes: parseInt(holes),
      gameType,
      status: 'in-progress',
      score: 0,
      par: parseInt(holes) === 18 ? 72 : 36,
      duration: '',
      weather: 'Sunny, 72°F',
    };

    onCreateGame(gameData);
    
    // Reset form
    setCourseName('');
    setPlayers('1');
    setHoles('18');
    setGameType('practice');
    
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New Game</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Type</Text>
            <View style={styles.gameTypeContainer}>
              {[
                { key: 'practice', label: 'Practice Round', icon: Target },
                { key: 'tournament', label: 'Tournament', icon: Trophy },
                { key: 'casual', label: 'Casual Play', icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.gameTypeButton,
                    gameType === key && styles.gameTypeButtonActive,
                  ]}
                  onPress={() => setGameType(key as any)}
                >
                  <Icon
                    color={gameType === key ? '#16a34a' : '#6b7280'}
                    size={20}
                  />
                  <Text
                    style={[
                      styles.gameTypeText,
                      gameType === key && styles.gameTypeTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Name</Text>
              <View style={styles.inputContainer}>
                <MapPin color="#6b7280" size={16} />
                <TextInput
                  style={styles.textInput}
                  value={courseName}
                  onChangeText={setCourseName}
                  placeholder="Enter course name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Players</Text>
                <View style={styles.inputContainer}>
                  <Users color="#6b7280" size={16} />
                  <TextInput
                    style={styles.textInput}
                    value={players}
                    onChangeText={setPlayers}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Holes</Text>
                <View style={styles.inputContainer}>
                  <Target color="#6b7280" size={16} />
                  <TextInput
                    style={styles.textInput}
                    value={holes}
                    onChangeText={setHoles}
                    keyboardType="numeric"
                    placeholder="18"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.inputContainer}>
                <Calendar color="#6b7280" size={16} />
                <TextInput
                  style={styles.textInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
            <Text style={styles.createButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  gameTypeContainer: {
    gap: 8,
  },
  gameTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 12,
  },
  gameTypeButtonActive: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  gameTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  gameTypeTextActive: {
    color: '#16a34a',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  createButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});