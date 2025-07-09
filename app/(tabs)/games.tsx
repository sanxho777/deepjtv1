import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameModal from '../../components/GameModal';
import ScorecardModal from '../../components/ScorecardModal';
import { useStorage, Game as StoredGame, Score } from '../../hooks/useStorage';

interface Game extends StoredGame {
  score: number;
  par: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  holes: number;
  duration: string;
  weather: string;
  gameType?: 'practice' | 'tournament' | 'casual';
}

export default function GamesScreen() {
  const { getGames, saveGame, getScores } = useStorage();
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const storedGames = await getGames();
      const storedScores = await getScores();
      setScores(storedScores);
      const gamesWithScores = storedGames.map(game => {
        const gameScores = storedScores.filter(score => score.gameId === game.id);
        const totalScore = gameScores.reduce((acc, score) => acc + score.score, 0);
        return {
          ...game,
          score: totalScore,
          par: 72, // Placeholder
          status: 'completed', // Placeholder
          holes: 18, // Placeholder
          duration: '4h', // Placeholder
          weather: 'Sunny', // Placeholder
        };
      });
      setGames(gamesWithScores);
    };
    loadData();
  }, []);

  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
  const [showGameModal, setShowGameModal] = useState(false);
  const [showScorecardModal, setScorecardModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filteredGames = games.filter(game => {
    if (activeFilter === 'all') return true;
    return game.status === activeFilter;
  });

  const completedGames = games.filter(game => game.status === 'completed');
  const averageScore = completedGames.length > 0 
    ? Math.round(completedGames.reduce((sum, game) => sum + game.score, 0) / completedGames.length)
    : 0;
  const bestScore = completedGames.length > 0 
    ? Math.min(...completedGames.map(game => game.score))
    : 0;

  const handleNewGame = () => {
    setShowGameModal(true);
  };

  const handleCreateGame = (gameData: any) => {
    const newGame: StoredGame = {
      id: Date.now().toString(),
      course: gameData.course,
      date: new Date().toISOString(),
      players: [gameData.player1, gameData.player2].filter(p => p),
    };
    saveGame(newGame);
    setGames(prev => [{ ...newGame, score: 0, par: 72, status: 'in-progress', holes: 18, duration: '', weather: '' }, ...prev]);
    Alert.alert('Game Started', `New round started at ${newGame.course}`);
  };

  const handleGamePress = (game: Game) => {
    setSelectedGame(game);
    setScorecardModal(true);
  };

  const handleSaveScore = (totalScore: number) => {
    if (selectedGame) {
      const updatedGames = games.map(game => 
        game.id === selectedGame.id 
          ? { ...game, score: totalScore, status: 'completed' as const, duration: '4h 15m' }
          : game
      );
      setGames(updatedGames);
    }
  };
  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Your Performance</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
          <View style={styles.statIcon}>
            <TrendingUp color="#16a34a" size={24} />
          </View>
          <Text style={styles.statValue}>{averageScore}</Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
          <View style={styles.statIcon}>
            <Award color="#3b82f6" size={24} />
          </View>
          <Text style={styles.statValue}>{bestScore}</Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
          <View style={styles.statIcon}>
            <Target color="#f59e0b" size={24} />
          </View>
          <Text style={styles.statValue}>{completedGames.length}</Text>
          <Text style={styles.statLabel}>Rounds Played</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: '#f3e8ff' }]}>
          <View style={styles.statIcon}>
            <Star color="#8b5cf6" size={24} />
          </View>
          <Text style={styles.statValue}>
            {completedGames.length > 0 ? Math.round(completedGames.filter(g => g.score < g.par + 10).length / completedGames.length * 100) : 0}%
          </Text>
          <Text style={styles.statLabel}>Good Rounds</Text>
        </View>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
        onPress={() => setActiveFilter('all')}
      >
        <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
          All Games
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilter]}
        onPress={() => setActiveFilter('completed')}
      >
        <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>
          Completed
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'upcoming' && styles.activeFilter]}
        onPress={() => setActiveFilter('upcoming')}
      >
        <Text style={[styles.filterText, activeFilter === 'upcoming' && styles.activeFilterText]}>
          Upcoming
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      case 'upcoming':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#16a34a', '#059669']}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Games</Text>
            <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
              <Plus color="#ffffff" size={20} />
              <Text style={styles.newGameButtonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderStats()}
        
        <View style={styles.gamesSection}>
          <Text style={styles.sectionTitle}>Recent Games</Text>
          {renderFilters()}
          
          <View style={styles.gamesList}>
            {filteredGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
              >
                <View style={styles.gameCardHeader}>
                  <View style={styles.gameInfo}>
                    <Text style={styles.courseName}>{game.course}</Text>
                    <View style={styles.gameDetails}>
                      <View style={styles.gameDetail}>
                        <Calendar color="#6b7280" size={14} />
                        <Text style={styles.gameDetailText}>
                          {new Date(game.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.gameDetail}>
                        <Users color="#6b7280" size={14} />
                        <Text style={styles.gameDetailText}>{game.players} players</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(game.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(game.status)}</Text>
                  </View>
                </View>
                
                <View style={styles.gameCardContent}>
                  <View style={styles.gameStats}>
                    {game.status === 'completed' && (
                      <View style={styles.scoreSummary}>
                        <Text style={styles.scoreValue}>{game.score}</Text>
                        <Text style={styles.scoreLabel}>Score</Text>
                        <Text style={[
                          styles.scoreDiff,
                          game.score > game.par ? styles.scoreOver : styles.scoreUnder
                        ]}>
                          {game.score === game.par ? 'E' : 
                           game.score > game.par ? `+${game.score - game.par}` : 
                           `${game.score - game.par}`}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.gameMetrics}>
                      <View style={styles.metric}>
                        <Target color="#6b7280" size={16} />
                        <Text style={styles.metricText}>{game.holes} holes</Text>
                      </View>
                      {game.duration && (
                        <View style={styles.metric}>
                          <Clock color="#6b7280" size={16} />
                          <Text style={styles.metricText}>{game.duration}</Text>
                        </View>
                      )}
                      <View style={styles.metric}>
                        <Zap color="#6b7280" size={16} />
                        <Text style={styles.metricText}>{game.weather}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {filteredGames.length === 0 && (
            <View style={styles.emptyState}>
              <Trophy color="#d1d5db" size={64} />
              <Text style={styles.emptyStateTitle}>No games found</Text>
              <Text style={styles.emptyStateText}>
                {activeFilter === 'all' 
                  ? 'Start your first game to see it here'
                  : `No ${activeFilter} games found`}
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleNewGame}>
                <Plus color="#ffffff" size={16} />
                <Text style={styles.emptyStateButtonText}>Start New Game</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <GameModal
        visible={showGameModal}
        onClose={() => setShowGameModal(false)}
        onCreateGame={handleCreateGame}
      />

      <ScorecardModal
        visible={showScorecardModal}
        onClose={() => setScorecardModal(false)}
        gameData={selectedGame}
        onSaveScore={handleSaveScore}
      />
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
  newGameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newGameButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  gamesSection: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#f0fdf4',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#16a34a',
  },
  gamesList: {
    gap: 12,
  },
  gameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  gameDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  gameDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  gameCardContent: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreSummary: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  scoreDiff: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  scoreOver: {
    color: '#dc2626',
  },
  scoreUnder: {
    color: '#16a34a',
  },
  gameMetrics: {
    flex: 1,
    paddingLeft: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});