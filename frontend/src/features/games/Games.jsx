import Header from "../../components/Header";
import { Link } from "react-router-dom";

import tictactoe from "../../assets/tictactoe.png";
import memoryflip from "../../assets/memoryflip.png";

const GAMES = [
  { name: "Tic Tac Toe", path: "/games/tictactoe", img: tictactoe },
  { name: "Memory Flip", path: "/games/memory", img: memoryflip }
];

export default function Games() {
  return (
    <>
      <Header />
      <main className="h-screen w-full overflow-hidden bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Mini Games</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GAMES.map((game) => (
              <Link
                to={game.path}
                key={game.name}
                className="bg-gray-900/50 border border-gray-700 rounded-2xl text-center shadow hover:shadow-xl hover:bg-orange-900/40 transition p-7 flex flex-col items-center justify-center"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="h-20 mb-4 object-contain"
                />
                <span className="text-lg font-semibold mb-1 hover:text-orange-400 transition">
                  {game.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
