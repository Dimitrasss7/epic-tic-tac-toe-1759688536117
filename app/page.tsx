'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon, TrophyIcon, RefreshIcon } from '@heroicons/react/24/solid';

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];

export default function EpicTicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  const checkWinner = (board: Board): Player => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell !== null) ? 'O' : null;
  };

  const makeComputerMove = (board: Board): Board => {
    const emptyCells = board.reduce((acc, cell, idx) => 
      cell === null ? [...acc, idx] : acc, [] as number[]);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = 'O';
    return newBoard;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const newWinner = checkWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      setScore(prev => ({
        ...prev,
        [newWinner]: prev[newWinner] + 1
      }));
    } else {
      const computerBoard = makeComputerMove(newBoard);
      const computerWinner = checkWinner(computerBoard);

      setBoard(computerBoard);
      if (computerWinner) {
        setWinner(computerWinner);
        setScore(prev => ({
          ...prev,
          [computerWinner]: prev[computerWinner] + 1
        }));
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer('X');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <div className="bg-blue-100 text-blue-800 p-2 rounded-lg flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2" /> X: {score.X}
            </div>
            <div className="bg-green-100 text-green-800 p-2 rounded-lg flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2" /> O: {score.O}
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <SunIcon className="h-6 w-6 text-yellow-500" /> : <MoonIcon className="h-6 w-6 text-purple-500" />}
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
          {board.map((cell, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(index)}
              className={`
                h-24 flex items-center justify-center text-6xl font-bold
                border-4 rounded-xl cursor-pointer transition-all
                ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}
                ${cell === 'X' ? 'text-blue-500' : 'text-green-500'}
              `}
            >
              {cell}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`
                p-6 rounded-xl text-2xl font-bold
                ${winner === 'X' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
              `}
            >
              {winner === 'X' ? 'Вы победили!' : 'Компьютер победил!'}
            </motion.div>
          )}
        </AnimatePresence>

        {(winner || board.every(cell => cell !== null)) && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetGame}
            className="
              mt-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500
              text-white rounded-xl flex items-center justify-center mx-auto
            "
          >
            <RefreshIcon className="h-6 w-6 mr-2" /> Новая игра
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}