import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Plus, Battery, Signal, Bluetooth, Settings, Trash2, CreditCard as Edit3, X, Check, CircleAlert as AlertCircle, Zap, Clock, MapPin, Wifi } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GolfBall {
  id: string;
  name: string;
  connected: boolean;
  battery: number;
  signal: 'excellent' | 'good' | 'fair' | 'poor';
  lastSeen: string;
  firmware: string;
  serialNumber: string;
  color: string;
  isActive: boolean;
  distance?: number;
  location?: string;
}

export default function BallsScreen() {
  const [balls, setBalls] = useState<GolfBall[]>([
    {
      id: '1',
      name: 'Pro Ball #1',
      connected: true,
      battery: 78,
      signal: 'excellent',
      lastSeen: 'Just now',
      firmware: '2.1.4',
      serialNumber: 'GB-2024-001',
      color: '#ffffff',
      isActive: true,
      distance: 86,
      location: 'Hole 4, Fairway',
    },
    {
      id: '2',
      name: 'Practice Ball',
      connected: false,
      battery: 45,
      signal: 'good',
      lastSeen: '5 min ago',
      firmware: '2.1.3',
      serialNumber: 'GB-2024-002',
      color: '#fef3c7',
      isActive: false,
      distance: 142,
      location: 'Hole 3, Rough',
    },
    {
      id: '3',
      name: 'Backup Ball',
      connected: false,
      battery: 12,
      signal: 'poor',
      lastSeen: '2 hours ago',
      firmware: '2.0.8',
      serialNumber: 'GB-2023-045',
      color: '#fee2e2',
      isActive: false,
      location: 'Last seen: Driving Range',
    },
  ]);

  const [selectedBall, setSelectedBall] = useState<GolfBall | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newBallName, setNewBallName] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleConnectBall = (ballId: string) => {
    setBalls(prev => prev.map(ball => 
      ball.id === ballId 
        ? { ...ball, connected: true, lastSeen: 'Just now' }
        : ball
    ));
    Alert.alert('Success', 'Ball connected successfully!');
  };

  const handleDisconnectBall = (ballId: string) => {
    setBalls(prev => prev.map(ball => 
      ball.id === ballId 
        ? { ...ball, connected: false, isActive: false }
        : ball
    ));
    Alert.alert('Disconnected', 'Ball has been disconnected');
  };

  const handleSetActiveBall = (ballId: string) => {
    setBalls(prev => prev.map(ball => ({
      ...ball,
      isActive: ball.id === ballId && ball.connected
    })));
    Alert.alert('Active Ball Set', 'This ball is now being tracked on the course');
  };

  const handleDeleteBall = (ballId: string) => {
    Alert.alert(
      'Delete Ball',
      'Are you sure you want to remove this ball from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setBalls(prev => prev.filter(ball => ball.id !== ballId))
        }
      ]
    );
  };

  const handleAddBall = () => {
    if (!newBallName.trim()) {
      Alert.alert('Error', 'Please enter a ball name');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      const newBall: GolfBall = {
        id: Date.now().toString(),
        name: newBallName.trim(),
        connected: false,
        battery: 100,
        signal: 'good',
        lastSeen: 'Never',
        firmware: '2.1.4',
        serialNumber: `GB-${Date.now()}`,
        color: '#ffffff',
        isActive: false,
      };
      
      setBalls(prev => [...prev, newBall]);
      setNewBallName('');
      setIsScanning(false);
      setShowAddModal(false);
      Alert.alert('Success', 'New ball added to your collection!');
    }, 3000);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSignalBars = (signal: string) => {
    switch (signal) {
      case 'excellent': return 4;
      case 'good': return 3;
      case 'fair': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return '#10b981';
    if (battery > 20) return '#f59e0b';
    return '#ef4444';
  };

  const renderBallCard = (ball: GolfBall) => (
    <TouchableOpacity
      key={ball.id}
      style={[
        styles.ballCard,
        ball.isActive && styles.activeBallCard,
        !ball.connected && styles.disconnectedBallCard
      ]}
      onPress={() => {
        setSelectedBall(ball);
        setShowDetailsModal(true);
      }}
    >
      <View style={styles.ballCardHeader}>
        <View style={styles.ballCardLeft}>
          <View style={[styles.ballVisual, { backgroundColor: ball.color }]}>
            <Target color={ball.connected ? '#16a34a' : '#6b7280'} size={20} />
          </View>
          <View style={styles.ballInfo}>
            <Text style={styles.ballName}>{ball.name}</Text>
            <Text style={styles.ballSerial}>{ball.serialNumber}</Text>
            {ball.isActive && (
              <View style={styles.activeBadge}>
                <Zap color="#16a34a" size={12} />
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.ballCardRight}>
          <View style={styles.ballMetrics}>
            <View style={styles.metric}>
              <Battery color={getBatteryColor(ball.battery)} size={16} />
              <Text style={styles.metricValue}>{ball.battery}%</Text>
            </View>
            <View style={styles.metric}>
              <View style={styles.signalBars}>
                {[1, 2, 3, 4].map(bar => (
                  <View
                    key={bar}
                    style={[
                      styles.signalBar,
                      bar <= getSignalBars(ball.signal) && {
                        backgroundColor: getSignalColor(ball.signal)
                      }
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.metricValue}>{ball.signal}</Text>
            </View>
          </View>
          
          <View style={styles.ballStatus}>
            <View style={[
              styles.statusDot,
              { backgroundColor: ball.connected ? '#10b981' : '#ef4444' }
            ]} />
            <Text style={styles.statusText}>
              {ball.connected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.ballCardContent}>
        <View style={styles.ballDetails}>
          <View style={styles.ballDetail}>
            <Clock color="#6b7280" size={14} />
            <Text style={styles.ballDetailText}>Last seen: {ball.lastSeen}</Text>
          </View>
          {ball.location && (
            <View style={styles.ballDetail}>
              <MapPin color="#6b7280" size={14} />
              <Text style={styles.ballDetailText}>{ball.location}</Text>
            </View>
          )}
          {ball.distance && (
            <View style={styles.ballDetail}>
              <Target color="#6b7280" size={14} />
              <Text style={styles.ballDetailText}>{ball.distance} yards away</Text>
            </View>
          )}
        </View>
        
        <View style={styles.ballActions}>
          {ball.connected ? (
            <>
              {!ball.isActive && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSetActiveBall(ball.id)}
                >
                  <Text style={styles.actionButtonText}>Set Active</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.disconnectButton]}
                onPress={() => handleDisconnectBall(ball.id)}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => handleConnectBall(ball.id)}
            >
              <Bluetooth color="#ffffff" size={16} />
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Ball Details</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetailsModal(false)}
          >
            <X color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>
        
        {selectedBall && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.ballDetailSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{selectedBall.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Serial Number:</Text>
                <Text style={styles.detailValue}>{selectedBall.serialNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Firmware:</Text>
                <Text style={styles.detailValue}>v{selectedBall.firmware}</Text>
              </View>
            </View>
            
            <View style={styles.ballDetailSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Connection:</Text>
                <Text style={[
                  styles.detailValue,
                  { color: selectedBall.connected ? '#10b981' : '#ef4444' }
                ]}>
                  {selectedBall.connected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Battery:</Text>
                <Text style={styles.detailValue}>{selectedBall.battery}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Signal:</Text>
                <Text style={styles.detailValue}>{selectedBall.signal}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Seen:</Text>
                <Text style={styles.detailValue}>{selectedBall.lastSeen}</Text>
              </View>
            </View>
            
            {selectedBall.location && (
              <View style={styles.ballDetailSection}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Position:</Text>
                  <Text style={styles.detailValue}>{selectedBall.location}</Text>
                </View>
                {selectedBall.distance && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Distance:</Text>
                    <Text style={styles.detailValue}>{selectedBall.distance} yards</Text>
                  </View>
                )}
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => {
                  setShowDetailsModal(false);
                  setTimeout(() => handleDeleteBall(selectedBall.id), 300);
                }}
              >
                <Trash2 color="#ef4444" size={20} />
                <Text style={styles.modalActionButtonText}>Delete Ball</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add New Ball</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowAddModal(false);
              setNewBallName('');
              setIsScanning(false);
            }}
          >
            <X color="#6b7280" size={24} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Ball Name</Text>
            <TextInput
              style={styles.textInput}
              value={newBallName}
              onChangeText={setNewBallName}
              placeholder="Enter ball name"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          {isScanning && (
            <View style={styles.scanningSection}>
              <View style={styles.scanningIndicator}>
                <Wifi color="#16a34a" size={32} />
              </View>
              <Text style={styles.scanningText}>Scanning for nearby balls...</Text>
              <Text style={styles.scanningSubtext}>
                Make sure your ball is powered on and nearby
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.addButton, isScanning && styles.disabledButton]}
            onPress={handleAddBall}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Bluetooth color="#ffffff" size={20} />
                <Text style={styles.addButtonText}>Scanning...</Text>
              </>
            ) : (
              <>
                <Plus color="#ffffff" size={20} />
                <Text style={styles.addButtonText}>Add Ball</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#16a34a', '#059669']}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>My Balls</Text>
            <TouchableOpacity
              style={styles.addBallHeaderButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{balls.length}</Text>
            <Text style={styles.quickStatLabel}>Total Balls</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{balls.filter(b => b.connected).length}</Text>
            <Text style={styles.quickStatLabel}>Connected</Text>
          </View>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{balls.filter(b => b.isActive).length}</Text>
            <Text style={styles.quickStatLabel}>Active</Text>
          </View>
        </View>

        <View style={styles.ballsList}>
          {balls.map(ball => renderBallCard(ball))}
          
          <TouchableOpacity
            style={styles.addBallCard}
            onPress={() => setShowAddModal(true)}
          >
            <Plus color="#6b7280" size={24} />
            <Text style={styles.addBallCardText}>Add New Golf Ball</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderDetailsModal()}
      {renderAddModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  addBallHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
  },
  quickStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginTop: 4,
  },
  ballsList: {
    gap: 16,
  },
  ballCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeBallCard: {
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  disconnectedBallCard: {
    opacity: 0.7,
  },
  ballCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ballCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ballVisual: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  ballInfo: {
    flex: 1,
  },
  ballName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  ballSerial: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 4,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#16a34a',
  },
  ballCardRight: {
    alignItems: 'flex-end',
  },
  ballMetrics: {
    gap: 8,
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  signalBars: {
    flexDirection: 'row',
    gap: 2,
  },
  signalBar: {
    width: 4,
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  ballStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  ballCardContent: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  ballDetails: {
    gap: 8,
    marginBottom: 16,
  },
  ballDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ballDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  ballActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  disconnectButton: {
    backgroundColor: '#fef2f2',
  },
  disconnectButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
  },
  connectButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  addBallCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    gap: 8,
  },
  addBallCardText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  ballDetailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalActions: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  modalActionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  scanningSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  scanningIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanningText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  scanningSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});