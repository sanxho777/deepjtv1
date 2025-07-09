import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Plus, Minus, Save, RotateCcw, Trophy, Target } from 'lucide-react-native';

interface Hole {
  number: number;
  par: number;
  score: number;
  strokes: number;
}

interface ScorecardModalProps {
  visible: boolean;
  onClose: () => void;
  gameData: any;
  onSaveScore: (totalScore: number) => void;
}

export default function ScorecardModal({ visible, onClose, gameData, onSaveScore }: ScorecardModalProps) {
  const [holes, setHoles] = useState<Hole[]>(() => {
    const holeCount = gameData?.holes || 18;
    const standardPars = holeCount === 18 
      ? [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4]
      : [4, 3, 5, 4, 4, 3, 4, 5, 4];
    
    return Array.from({ length: holeCount }, (_, i) => ({
      number: i + 1,
      par: standardPars[i] || 4,
      score: 0,
      strokes: 0,
    }));
  });

  const updateScore = (holeIndex: number, change: number) => {
    setHoles(prev => prev.map((hole, index) => 
      index === holeIndex 
        ? { ...hole, score: Math.max(0, hole.score + change) }
        : hole
    ));
  };

  const resetScores = () => {
    Alert.alert(
      'Reset Scorecard',
      'Are you sure you want to reset all scores?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => setHoles(prev => prev.map(hole => ({ ...hole, score: 0 })))
        }
      ]
    );
  };

  const saveScorecard = () => {
    const totalScore = holes.reduce((sum, hole) => sum + hole.score, 0);
    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
    
    Alert.alert(
      'Save Scorecard',
      `Total Score: ${totalScore}\nPar: ${totalPar}\nDifference: ${totalScore === totalPar ? 'E' : totalScore > totalPar ? `+${totalScore - totalPar}` : `${totalScore - totalPar}`}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            onSaveScore(totalScore);
            onClose();
            Alert.alert('Success', 'Scorecard saved successfully!');
          }
        }
      ]
    );
  };

  const totalScore = holes.reduce((sum, hole) => sum + hole.score, 0);
  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
  const difference = totalScore - totalPar;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Scorecard</Text>
            <Text style={styles.subtitle}>{gameData?.course || 'Golf Course'}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalScore}</Text>
            <Text style={styles.summaryLabel}>Total Score</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalPar}</Text>
            <Text style={styles.summaryLabel}>Par</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[
              styles.summaryValue,
              difference > 0 ? styles.scoreOver : 
              difference < 0 ? styles.scoreUnder : styles.scorePar
            ]}>
              {difference === 0 ? 'E' : difference > 0 ? `+${difference}` : `${difference}`}
            </Text>
            <Text style={styles.summaryLabel}>Difference</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.scorecardHeader}>
            <Text style={styles.headerCell}>Hole</Text>
            <Text style={styles.headerCell}>Par</Text>
            <Text style={styles.headerCell}>Score</Text>
            <Text style={styles.headerCell}>+/-</Text>
          </View>

          {holes.map((hole, index) => (
            <View key={hole.number} style={[
              styles.holeRow,
              index % 2 === 0 && styles.holeRowEven
            ]}>
              <Text style={styles.holeCell}>{hole.number}</Text>
              <Text style={styles.holeCell}>{hole.par}</Text>
              
              <View style={styles.scoreControls}>
                <TouchableOpacity
                  style={styles.scoreButton}
                  onPress={() => updateScore(index, -1)}
                >
                  <Minus color="#6b7280" size={16} />
                </TouchableOpacity>
                <Text style={styles.scoreValue}>{hole.score || '-'}</Text>
                <TouchableOpacity
                  style={styles.scoreButton}
                  onPress={() => updateScore(index, 1)}
                >
                  <Plus color="#6b7280" size={16} />
                </TouchableOpacity>
              </View>
              
              <Text style={[
                styles.holeCell,
                hole.score > hole.par ? styles.scoreOver :
                hole.score < hole.par && hole.score > 0 ? styles.scoreUnder : styles.scorePar
              ]}>
                {hole.score === 0 ? '-' :
                 hole.score === hole.par ? 'E' :
                 hole.score > hole.par ? `+${hole.score - hole.par}` :
                 `${hole.score - hole.par}`}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetScores}>
            <RotateCcw color="#6b7280" size={16} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveScorecard}>
            <Save color="#ffffff" size={16} />
            <Text style={styles.saveButtonText}>Save Game</Text>
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
  summary: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scorecardHeader: {
    flexDirection: 'row',
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  holeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  holeRowEven: {
    backgroundColor: '#f9fafb',
  },
  holeCell: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  scoreControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scoreButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  scoreOver: {
    color: '#dc2626',
  },
  scoreUnder: {
    color: '#16a34a',
  },
  scorePar: {
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});