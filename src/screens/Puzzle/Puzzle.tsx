import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/RootNavigator';

type PuzzleNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Puzzle'>;

// Helpers for the sliding puzzle logic
const createSolvedBoard = () => [1, 2, 3, 4, 5, 6, 7, 8, 0];

// Shuffle the board by simulating random valid moves so it's always solvable
const shuffleBoard = (board: number[]) => {
  let b = [...board];
  for (let i = 0; i < 150; i++) {
    const emptyIdx = b.indexOf(0);
    const validMoves = [];
    if (emptyIdx % 3 !== 0) validMoves.push(emptyIdx - 1); // Left
    if (emptyIdx % 3 !== 2) validMoves.push(emptyIdx + 1); // Right
    if (emptyIdx >= 3) validMoves.push(emptyIdx - 3);      // Up
    if (emptyIdx < 6) validMoves.push(emptyIdx + 3);       // Down
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    [b[emptyIdx], b[move]] = [b[move], b[emptyIdx]];
  }
  return b;
};

export default function Puzzle() {
  const navigation = useNavigation<PuzzleNavigationProp>();

  const [board, setBoard] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setBoard(shuffleBoard(createSolvedBoard()));
    setIsWon(false);
  };

  const handleTilePress = (index: number) => {
    if (isWon) return;
    
    const emptyIdx = board.indexOf(0);
    // Check if the tapped tile is directly adjacent to the empty tile (0)
    const isAdjacent =
      (Math.abs(emptyIdx - index) === 1 && Math.floor(emptyIdx / 3) === Math.floor(index / 3)) ||
      Math.abs(emptyIdx - index) === 3;

    if (isAdjacent) {
      const newBoard = [...board];
      [newBoard[emptyIdx], newBoard[index]] = [newBoard[index], newBoard[emptyIdx]];
      setBoard(newBoard);
      
      if (newBoard.join(',') === createSolvedBoard().join(',')) {
        setIsWon(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Puzzle</Text>
      </View>

      <View style={styles.gameContainer}>
        <View style={styles.board}>
          {board.map((tile, index) => (
            <View key={index} style={styles.tileContainer}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => handleTilePress(index)}
                disabled={tile === 0 || isWon}
              >
                {tile !== 0 ? (
                  <View style={styles.tileOuter}>
                    <View style={styles.tileInner}>
                      <Text style={styles.tileText}>{tile}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyTile} />
                )}
              </Pressable>
            </View>
          ))}
        </View>

        {isWon ? (
          <View style={styles.winContainer}>
            <Text style={styles.winText}>You Won! 🎉</Text>
          </View>
        ) : (
          <Text style={styles.footerHintText}>
            Tap the tiles next to the empty space to slide them.
          </Text>
        )}

        <Pressable style={styles.btnOuter} onPress={startNewGame}>
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>Restart Game</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2247', // Luxury Dark Navy
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#2A2D5C',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  headerTitle: {
    marginLeft: 16,
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  gameContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  board: {
    width: 340,
    height: 340,
    backgroundColor: '#161836', // Deep elegant inset background
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },

  tileContainer: {
    width: '33.33%',
    height: '33.33%',
    padding: 6,
  },

  tileOuter: {
    flex: 1,
    backgroundColor: '#D97706', // Darker bottom edge for 3D effect
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  tileInner: {
    flex: 1,
    backgroundColor: '#FBBF24', // Brighter amber top surface
    borderRadius: 16,
    transform: [{ translateY: -4 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyTile: {
    flex: 1,
    backgroundColor: '#11132B',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#161836',
  },

  tileText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#78350F', // Rich dark brown
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  winContainer: {
    marginTop: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#10B981', // Emerald green
    borderRadius: 30,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  winText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  footerHintText: {
    marginTop: 24,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },

  // --- 3D Button Styles (Matching HomeScreen) ---
  btnOuter: {
    backgroundColor: '#D6EFFF',
    borderRadius: 28,
    marginTop: 35,
    width: 220,
  },

  btnInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    transform: [{ translateY: -6 }],
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#422411',
  },
});
