import Header from "../../components/Header";
import { useState } from "react";

const EMOJIS = ["🍎","🚗","🔥","🌙","🎲","☂️","❤️","🐱"];
const shuffle = () => [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);

export default function MemoryFlip() {
  const [cards, setCards] = useState(shuffle());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [tries, setTries] = useState(0);

  const handleFlip = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setTimeout(() => {
        const [a, b] = next;
        if (cards[a] === cards[b]) setMatched((m) => [...m, a, b]);
        setFlipped([]);
        setTries((t) => t + 1);
      }, 700);
    }
  };

  const restart = () => {
    setCards(shuffle());
    setFlipped([]);
    setMatched([]);
    setTries(0);
  };

  const completed = matched.length === cards.length;

  return (
    <>
      <Header />
      <main
        className="w-full bg-black text-white flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <h2 className="text-2xl font-bold mb-4">Memory Flip</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {cards.map((emoji, i) => (
            <button
              key={i}
              className={`w-16 h-16 rounded-lg text-2xl border-2 
                ${flipped.includes(i) || matched.includes(i)
                  ? "bg-orange-500 border-orange-400"
                  : "bg-gray-900/50 border-gray-700"}`}
              onClick={() => handleFlip(i)}
              disabled={flipped.length === 2 || matched.includes(i)}
            >
              {flipped.includes(i) || matched.includes(i) ? emoji : ""}
            </button>
          ))}
        </div>
        <div className="text-md mb-3">Tries: {tries}</div>
        {completed && (
          <div className="mb-3 text-lg font-bold text-green-400 animate-pulse">
            Congratulations! You puzzled within <span className="text-orange-400">{tries}</span> tries 🎉
          </div>
        )}
        <button
          onClick={restart}
          className="px-6 py-2 bg-orange-500 rounded-xl text-white font-bold hover:bg-orange-600"
        >
          Restart
        </button>
      </main>
    </>
  );
}
