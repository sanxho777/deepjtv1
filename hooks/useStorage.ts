import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORE_KEY = 'scores';
const GAME_KEY = 'games';

export interface Score {
  gameId: string;
  hole: number;
  score: number;
}

export interface Game {
  id: string;
  course: string;
  date: string;
  players: string[];
}

export const useStorage = () => {
  const saveScore = async (score: Score) => {
    try {
      const existingScores = await getScores();
      const newScores = [...existingScores, score];
      const jsonValue = JSON.stringify(newScores);
      await AsyncStorage.setItem(SCORE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving score', e);
    }
  };

  const getScores = async (): Promise<Score[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCORE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting scores', e);
      return [];
    }
  };

  const saveGame = async (game: Game) => {
    try {
      const existingGames = await getGames();
      const newGames = [...existingGames, game];
      const jsonValue = JSON.stringify(newGames);
      await AsyncStorage.setItem(GAME_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving game', e);
    }
  };

  const getGames = async (): Promise<Game[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(GAME_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting games', e);
      return [];
    }
  };

  return {
    saveScore,
    getScores,
    saveGame,
    getGames,
  };
};
