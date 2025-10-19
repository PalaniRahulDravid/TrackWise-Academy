import Header from "../../components/Header";
import { useState, useEffect, useRef } from "react";

// Customizable grid and emoji
const GRID = 3; // 3x3 board
const MOLE_EMOJIS = ["😆", "🤪", "😂", "😝", "😜", "🤣"];
const GAME_TIME = 30; // in seconds

function getRandomIndex(prev) {
  // Don't allow same active mole twice consecutively (for more fun!)
  let idx;
  do {
    idx = Math.floor(Math.random() * GRID * GRID);
  } while (idx === prev);
  return idx;
}

export default function WhackAMole() {
  const [active, setActive] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [playing, setPlaying] = useState(false);
  const [bonkIdx, setBonkIdx] = useState(-1);
  const timerRef = useRef();

  // Start / reset
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setPlaying(true);
    setActive(getRandomIndex(-1));
  };

  // Handle timer
  useEffect(() => {
    if (playing && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (playing && timeLeft === 0) {
      setPlaying(false);
      setActive(-1);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, playing]);

  // Mole movement (every 800ms)
  useEffect(() => {
    if (!playing) return;
    const move = setInterval(() => setActive(a => getRandomIndex(a)), 800);
    return () => clearInterval(move);
  }, [playing]);

  // Sound/animation for bonk
  useEffect(() => {
    if (bonkIdx !== -1) {
      const t = setTimeout(() => setBonkIdx(-1), 350);
      return () => clearTimeout(t);
    }
  }, [bonkIdx]);

  // Handle whack
  const whack = idx => {
    if (!playing || timeLeft === 0 || idx !== active) return;
    setScore(s => s + 1);
    setBonkIdx(idx);
    setActive(getRandomIndex(active));
  };

  // Make grid in mobile smaller
  const getButtonSize = () => {
    if (window.innerWidth < 420) return 60;
    if (window.innerWidth < 900) return 80;
    return 90;
  };
  const [btnSize, setBtnSize] = useState(getButtonSize());
  useEffect(() => {
    const handle = () => setBtnSize(getButtonSize());
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <>
      <Header />
      <main
        className="w-full min-h-screen bg-black flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <h2 className="text-2xl text-white font-bold mb-2 mt-3 text-center drop-shadow-lg">
          Whack-a-Mole <span className="ml-1">🎉</span>
        </h2>
        <div className="flex gap-8 items-baseline mb-3 mt-2 select-none">
          <span className="text-orange-400 font-bold text-xl drop-shadow">Score: {score}</span>
          <span className={`font-semibold text-lg sm:text-xl rounded px-3 py-1 ${timeLeft > 5 ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"} transition`}>
            {playing ? `${timeLeft}s` : `0s`}
          </span>
        </div>
        {/* Game grid */}
        <div
          className={
            "grid rounded-xl bg-black border-2 border-[#262a38] shadow-xl"
          }
          style={{
            gridTemplateColumns: `repeat(${GRID}, ${btnSize}px)`,
            gridTemplateRows: `repeat(${GRID}, ${btnSize}px)`,
            gap: 12,
            padding: 16,
            marginBottom: 14
          }}
        >
          {Array.from({ length: GRID * GRID }).map((_, i) => (
            <button
              key={i}
              className={
                `transition-all text-3xl sm:text-4xl md:text-5xl font-black rounded-full flex items-center justify-center border-2 border-[#1f1f2f] outline-none
                 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg active:scale-95
                 ${i === active && playing
                    ? <span style={{ pointerEvents: "none" }}>
                        {MOLE_EMOJIS[Math.floor(Math.random() * MOLE_EMOJIS.length)]}
                        </span>
                    : " "}
                 ${i === bonkIdx ? "animate-ping bg-pink-500 shadow-pink-700" : ""}
                 disabled:opacity-50`
              }
              style={{
                width: btnSize,
                height: btnSize,
                userSelect: "none",
                cursor: playing && timeLeft > 0 && i === active ? "pointer" : "default"
              }}
              tabIndex={-1}
              aria-label={i === active && playing ? "Whack me!" : ""}
              onClick={() => whack(i)}
              disabled={!playing || i !== active || timeLeft <= 0}
            >
              {i === active && playing
                ? MOLE_EMOJIS[Math.floor(Math.random() * MOLE_EMOJIS.length)]
                : " "}
              {i === bonkIdx && (
                <span
                  className="absolute"
                  style={{ fontSize: btnSize > 70 ? 36 : 20, right: 14, top: 10 }}
                  aria-hidden
                >
                  💥
                </span>
              )}
            </button>
          ))}
        </div>
        {/* End state / control */}
        {!playing && (
          <div className="flex flex-col items-center gap-3 mt-3 mb-2">
            {timeLeft === 0 &&
              <div className="text-green-400 text-lg mb-2 font-bold animate-pulse">
                Awesome! You whacked {score} mole{score === 1 ? "" : "s"}! 😂
              </div>}
            <button
              className="mt-1 px-7 py-2 text-lg bg-gradient-to-b from-orange-400 to-orange-600 rounded-2xl text-white font-bold shadow hover:scale-105 transition"
              onClick={startGame}
            >
              {timeLeft === 0 ? "Play Again" : "Start Game"}
            </button>
            <div className="text-gray-400 text-sm mt-1">👉 Click the emoji as fast as you can!</div>
          </div>
        )}
      </main>
    </>
  );
}
