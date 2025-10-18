import Header from "../../components/Header";
import { useState } from "react";

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const current = history[step];
  const xIsNext = step % 2 === 0;
  const winner = calculateWinner(current);

  function handleClick(i) {
    const next = current.slice();
    if (winner || next[i]) return;
    next[i] = xIsNext ? "X" : "O";
    const newHist = history.slice(0, step + 1).concat([next]);
    setHistory(newHist);
    setStep(newHist.length - 1);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setStep(0);
  }

  function renderSquare(i) {
    return (
      <button
        onClick={() => handleClick(i)}
        className="w-16 h-16 text-2xl font-bold rounded bg-gray-900/50 border border-gray-700
                hover:bg-orange-700/30 transition"
      >
        {current[i]}
      </button>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-28 min-h-screen bg-black flex flex-col items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Tic Tac Toe</h2>
        <div className="inline-grid grid-cols-3 gap-3 mb-4">
          {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
        </div>
        <div className="mb-2">
          {winner
            ? <span className="text-orange-400 font-semibold">{winner} Wins!</span>
            : step === 9
              ? <span className="text-pink-400 font-semibold">Draw!</span>
              : <span>Next: {xIsNext ? "X" : "O"}</span>
          }
        </div>
        <button
          className="mt-4 px-6 py-2 bg-orange-500 rounded-xl text-white hover:bg-orange-600 transition font-bold"
          onClick={restart}
        >
          Restart
        </button>
      </main>
    </>
  );
}
