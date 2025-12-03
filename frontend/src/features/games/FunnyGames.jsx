import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

import Snake from "../../assets/Snake.png";
import whackamole from "../../assets/whackamole.png";

const FUNNY_GAMES = [
  { name: "Snake", path: "/games/snake", img: Snake },
  { name: "Whack-a-Mole", path: "/games/whackamole", img: whackamole },
];

export default function FunnyGames() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="w-full bg-black text-white flex flex-col items-center justify-center px-4" style={{ minHeight: "calc(100vh - 96px)" }}>
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Funny Games</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FUNNY_GAMES.map((game) => (
              <button
                key={game.name}
                onClick={() => navigate(game.path)}
                className="bg-gray-900/50 border border-gray-700 rounded-lg text-center shadow hover:shadow-xl hover:bg-orange-900/40 transition p-7 flex flex-col items-center justify-center cursor-pointer"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="h-20 mb-4 object-contain"
                />
                <span className="text-lg font-semibold mb-1 hover:text-orange-400 transition">
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
