import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

import tictactoe from "../../assets/tictactoe.png";
import memoryflip from "../../assets/memoryflip.png";

const MIND_GAMES = [
  { name: "Tic Tac Toe", path: "/games/tictactoe", img: tictactoe },
  { name: "Memory Flip", path: "/games/memory", img: memoryflip },
];

export default function MindGames() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="w-full bg-black text-white flex flex-col items-center justify-center px-4" style={{ minHeight: "calc(100vh - 96px)" }}>
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Mind Games</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MIND_GAMES.map((game) => (
              <button
                key={game.name}
                onClick={() => navigate(game.path)}
                className="bg-gray-900/50 border border-gray-700 rounded-lg text-center shadow hover:shadow-xl hover:bg-blue-900/40 transition p-7 flex flex-col items-center justify-center cursor-pointer"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="h-20 mb-4 object-contain"
                />
                <span className="text-lg font-semibold mb-1 hover:text-blue-400 transition">
                  {game.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
