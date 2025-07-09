import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bluetooth, 
  User, 
  MapPin, 
  Navigation, 
  Plus,
  Battery,
  Signal,
  Target,
  Clock,
  RotateCcw,
  Save,
  TrendingUp,
  Award,
  Zap,
  Timer,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileModal from '../../components/ProfileModal';
import ScorecardModal from '../../components/ScorecardModal';
import Navigation3D from '../../components/Navigation3D';
import useBLE from '../../hooks/useBLE';
import { Device } from 'react-native-ble-plx';

const { width, height } = Dimensions.get('window');

interface GolfBall {
  id: string;
  name: string;
  connected: boolean;
  distance: number;
  battery: number;
  lastSeen: string;
  position: { x: number; y: number; z: number; };
  device: Device | null;
}

interface ScoreData {
  hole: number;
  par: number;
  score: number;
}

export default function HomeScreen() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE();
  const [isBleModalVisible, setIsBleModalVisible] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'tracking' | 'scorecard' | 'stats'>('tracking');
  const [balls, setBalls] = useState<GolfBall[]>([
    {
      id: '1',
      name: 'Ball #1',
      connected: false,
      distance: 0,
      battery: 0,
      lastSeen: 'Not connected',
      position: { x: 10, y: 0, z: -10 },
      device: null,
    },
  ]);
  
  const [scoreData, setScoreData] = useState<ScoreData[]>([
    { hole: 1, par: 4, score: 0 },
    { hole: 2, par: 3, score: 0 },
    { hole: 3, par: 5, score: 0 },
    { hole: 4, par: 3, score: 0 },
  ]);

  const [pulseAnimation] = useState(new Animated.Value(1));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScorecardModal, setScorecardModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [selectedBall, setSelectedBall] = useState<GolfBall | null>(null);
  const [currentGame, setCurrentGame] = useState({
    course: 'Pebble Creek Golf Club',
    holes: 18,
    par: 72,
  });

  const openBleModal = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
      setIsBleModalVisible(true);
    } else {
      Alert.alert('Permissions required', 'Please grant bluetooth permissions to use this feature.');
    }
  };

  const handleConnectBall = (device: Device) => {
    connectToDevice(device);
    setIsBleModalVisible(false);
  };

  useEffect(() => {
    if (connectedDevice) {
      setBalls(prev =>
        prev.map(ball =>
          ball.id === '1'
            ? {
                ...ball,
                connected: true,
                device: connectedDevice,
                name: connectedDevice.name || 'Golf Ball',
              }
            : ball,
        ),
      );
    }
  }, [connectedDevice]);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
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
  }, []);

  const handleProfilePress = () => {
    setShowProfileModal(true);
  };

  const handleSaveProfile = (profileData: any) => {
    console.log('Profile saved:', profileData);
  };

  const handleScorecardPress = () => {
    setScorecardModal(true);
  };

  const handleSaveScore = (totalScore: number) => {
    Alert.alert('Score Saved', `Your score of ${totalScore} has been saved!`);
  };

  const handleBallPress = (ball: GolfBall) => {
    setSelectedBall(ball);
    setShowNavigationModal(true);
  };

  const updateScore = (hole: number, newScore: number) => {
    setScoreData(prev => prev.map(item => 
      item.hole === hole ? { ...item, score: newScore } : item
    ));
  };

  const calculateTotal = () => {
    const totalPar = scoreData.reduce((sum, item) => sum + item.par, 0);
    const totalScore = scoreData.reduce((sum, item) => sum + item.score, 0);
    return { totalPar, totalScore, difference: totalScore - totalPar };
  };

  const totals = calculateTotal();

  const renderHeader = () => (
    <LinearGradient
      colors={['#16a34a', '#059669']}
      style={styles.header}
    >
      <SafeAreaView style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Target color="#ffffff" size={28} />
            <Text style={styles.headerTitle}>JackTrack</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.connectButton}
              onPress={openBleModal}
            >
              <Bluetooth color="#ffffff" size={16} />
              <Text style={styles.connectButtonText}>
                {connectedDevice ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
              <User color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderMap = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>Hole #4 - Par 3</Text>
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton}>
            <Navigation color="#6b7280" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <MapPin color="#6b7280" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      
      <LinearGradient
        colors={['#4ade80', '#22c55e']}
        style={styles.golfMap}
      >
        <Text style={{color: 'white'}}>3D Map will be in the navigation modal</Text>
      </LinearGradient>
      
      <View style={styles.mapActions}>
        <TouchableOpacity style={styles.navigateButton} onPress={() => balls[0] && handleBallPress(balls[0])}>
          <Navigation color="#ffffff" size={16} />
          <Text style={styles.navigateButtonText}>Navigate to Ball</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchHoleButton}>
          <Text style={styles.switchHoleButtonText}>Switch Hole</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'tracking' && styles.activeTab]}
        onPress={() => setActiveTab('tracking')}
      >
        <Target color={activeTab === 'tracking' ? '#16a34a' : '#6b7280'} size={16} />
        <Text style={[styles.tabText, activeTab === 'tracking' && styles.activeTabText]}>
          Tracking
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'scorecard' && styles.activeTab]}
        onPress={() => setActiveTab('scorecard')}
      >
        <Save color={activeTab === 'scorecard' ? '#16a34a' : '#6b7280'} size={16} />
        <Text style={[styles.tabText, activeTab === 'scorecard' && styles.activeTabText]}>
          Scorecard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
        onPress={() => setActiveTab('stats')}
      >
        <TrendingUp color={activeTab === 'stats' ? '#16a34a' : '#6b7280'} size={16} />
        <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
          Stats
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrackingTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Paired Balls</Text>
      
      {balls.map((ball, index) => (
        <TouchableOpacity
          key={ball.id}
          style={[styles.ballCard, !ball.connected && styles.ballCardDisconnected]}
          onPress={() => ball.connected && handleBallPress(ball)}
        >
          <View style={styles.ballCardLeft}>
            <View style={[styles.ballIcon, ball.connected ? styles.ballIconConnected : styles.ballIconDisconnected]}>
              <Target color={ball.connected ? '#16a34a' : '#ef4444'} size={20} />
            </View>
            <View style={styles.ballInfo}>
              <Text style={styles.ballName}>{ball.name}</Text>
              <View style={styles.ballStatus}>
                <Clock color="#6b7280" size={12} />
                <Text style={styles.ballStatusText}>{ball.connected ? 'Connected' : 'Disconnected'}</Text>
              </View>
              {ball.connected && (
                <View style={styles.ballMetrics}>
                  <View style={styles.ballMetric}>
                    <Battery color="#10b981" size={12} />
                    <Text style={styles.ballMetricText}>{ball.battery}%</Text>
                  </View>
                  <View style={styles.ballMetric}>
                    <Signal color="#3b82f6" size={12} />
                    <Text style={styles.ballMetricText}>Strong</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.ballCardRight}>
            {ball.connected ? (
              <View style={styles.ballDistance}>
                <Text style={styles.ballDistanceValue}>{ball.distance} yd</Text>
                <Text style={styles.ballDistanceLabel}>from position</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.connectBallButton} onPress={openBleModal}>
                <Text style={styles.connectBallButtonText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderScorecardTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Scorecard</Text>
      
      <View style={styles.scorecard}>
        <View style={styles.scorecardHeader}>
          <Text style={styles.scorecardHeaderText}>Hole</Text>
          <Text style={styles.scorecardHeaderText}>Par</Text>
          <Text style={styles.scorecardHeaderText}>Score</Text>
          <Text style={styles.scorecardHeaderText}>+/-</Text>
        </View>
        
        {scoreData.map((item, index) => (
          <View key={item.hole} style={[styles.scorecardRow, index % 2 === 0 && styles.scorecardRowEven]}>
            <Text style={styles.scorecardCell}>{item.hole}</Text>
            <Text style={styles.scorecardCell}>{item.par}</Text>
            <TouchableOpacity
              style={styles.scoreInput}
              onPress={() => Alert.alert('Score', `Update score for hole ${item.hole}`)}
            >
              <Text style={styles.scoreInputText}>{item.score}</Text>
            </TouchableOpacity>
            <Text style={[
              styles.scorecardCell,
              item.score > item.par ? styles.scoreOver : 
              item.score < item.par ? styles.scoreUnder : styles.scorePar
            ]}>
              {item.score === item.par ? 'E' : 
               item.score > item.par ? `+${item.score - item.par}` : 
               `${item.score - item.par}`}
            </Text>
          </View>
        ))}
        
        <View style={styles.scorecardTotal}>
          <Text style={styles.scorecardTotalText}>Total</Text>
          <Text style={styles.scorecardTotalText}>{totals.totalPar}</Text>
          <Text style={styles.scorecardTotalText}>{totals.totalScore}</Text>
          <Text style={[
            styles.scorecardTotalText,
            totals.difference > 0 ? styles.scoreOver : 
            totals.difference < 0 ? styles.scoreUnder : styles.scorePar
          ]}>
            {totals.difference === 0 ? 'E' : 
             totals.difference > 0 ? `+${totals.difference}` : 
             `${totals.difference}`}
          </Text>
        </View>
      </View>
      
      <View style={styles.scorecardActions}>
        <TouchableOpacity style={styles.resetButton}>
          <RotateCcw color="#6b7280" size={16} />
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleScorecardPress}>
          <Save color="#ffffff" size={16} />
          <Text style={styles.saveButtonText}>Open Scorecard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Your Statistics</Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tracking':
        return renderTrackingTab();
      case 'scorecard':
        return renderScorecardTab();
      case 'stats':
        return renderStatsTab();
      default:
        return renderTrackingTab();
    }
  };

  const renderDeviceModal = () => {
    const renderItem = ({ item }: { item: Device }) => (
      <TouchableOpacity style={styles.deviceItem} onPress={() => handleConnectBall(item)}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>
      </TouchableOpacity>
    );

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBleModalVisible}
        onRequestClose={() => setIsBleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan for Devices</Text>
            <FlatList
              data={allDevices}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsBleModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderMap()}
        {renderTabs()}
        {renderTabContent()}
      </ScrollView>

      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
      />

      <ScorecardModal
        visible={showScorecardModal}
        onClose={() => setScorecardModal(false)}
        gameData={currentGame}
        onSaveScore={handleSaveScore}
      />

      <Navigation3D
        visible={showNavigationModal}
        onClose={() => setShowNavigationModal(false)}
        ball={selectedBall}
      />

      {renderDeviceModal()}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#ffffff',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
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
  mapContainer: {
    marginBottom: 24,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    color: '#111827',
  },
  mapControls: {
    flexDirection: 'row',
    gap: 8,
  },
  mapControlButton: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
  },
  golfMap: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  navigateButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navigateButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  switchHoleButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  switchHoleButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#f0fdf4',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#16a34a',
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  ballCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ballCardDisconnected: {
    opacity: 0.6,
  },
  ballCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ballIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ballIconConnected: {
    backgroundColor: '#f0fdf4',
  },
  ballIconDisconnected: {
    backgroundColor: '#fef2f2',
  },
  ballInfo: {
    flex: 1,
  },
  ballName: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  ballStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ballStatusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  ballMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  ballMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ballMetricText: {
    fontSize: 12,
    color: '#374151',
  },
  ballCardRight: {
    alignItems: 'flex-end',
  },
  ballDistance: {
    alignItems: 'flex-end',
  },
  ballDistanceValue: {
    fontSize: 18,
    color: '#111827',
  },
  ballDistanceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  connectBallButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectBallButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  scorecard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scorecardHeader: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  scorecardHeaderText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  scorecardRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scorecardRowEven: {
    backgroundColor: '#f9fafb',
  },
  scorecardCell: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  scoreInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 8,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  scoreInputText: {
    fontSize: 14,
    color: '#374151',
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
  scorecardTotal: {
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  scorecardTotalText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },
  scorecardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  deviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  deviceName: {
    fontSize: 16,
  },
  deviceRssi: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 14,
    color: '#374151',
  },
});