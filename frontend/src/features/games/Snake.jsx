import Header from "../../components/Header";
import { useState, useEffect, useRef, useCallback } from "react";

const BOARD_SIZE = 12;
const INIT_SNAKE = [
  { x: 6, y: 6 },
  { x: 5, y: 6 }
];
const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

function getRandomCell(snake) {
  let cell;
  do {
    cell = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
  } while (snake.some(s => s.x === cell.x && s.y === cell.y));
  return cell;
}

export default function Snake() {
  const [snake, setSnake] = useState([...INIT_SNAKE]);
  const [direction, setDirection] = useState("ArrowRight");
  const [food, setFood] = useState(getRandomCell(INIT_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef();

  // Cell size responsive for mobile/tab, desktop lo untouched
  const getCellSize = () => {
    if (window.innerWidth <= 480) return 20; // small/vertical mobile
    if (window.innerWidth <= 768) return 28; // tablets
    return 32; // desktop, this is 2rem
  };

  const [cellSize, setCellSize] = useState(getCellSize());
  useEffect(() => {
    const onResize = () => setCellSize(getCellSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (DIRS[e.key]) {
        setDirection(prev => {
          if (
            (e.key === "ArrowUp" && prev === "ArrowDown") ||
            (e.key === "ArrowDown" && prev === "ArrowUp") ||
            (e.key === "ArrowLeft" && prev === "ArrowRight") ||
            (e.key === "ArrowRight" && prev === "ArrowLeft")
          ) return prev;
          if (!started) setStarted(true);
          return e.key;
        });
      }
      if (gameOver && e.key === "Enter") restart();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver, started]);

  useEffect(() => {
    if (gameOver || !started) return;
    intervalRef.current = setInterval(step, 160);
    return () => clearInterval(intervalRef.current);
  }, [snake, direction, gameOver, started]);

  const step = useCallback(() => {
    setSnake(currSnake => {
      const head = { ...currSnake[0] };
      const dir = DIRS[direction];
      head.x += dir.x;
      head.y += dir.y;
      if (
        head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE ||
        currSnake.some(seg => seg.x === head.x && seg.y === head.y)
      ) {
        setGameOver(true);
        return currSnake;
      }
      let newSnake;
      if (head.x === food.x && head.y === food.y) {
        newSnake = [head, ...currSnake];
        setScore(s => s + 1);
        setFood(getRandomCell([head, ...currSnake]));
      } else {
        newSnake = [head, ...currSnake.slice(0, -1)];
      }
      return newSnake;
    });
  }, [direction, food]);

  const restart = () => {
    setScore(0);
    setSnake([...INIT_SNAKE]);
    setFood(getRandomCell(INIT_SNAKE));
    setDirection("ArrowRight");
    setStarted(false);
    setGameOver(false);
  };

  function cellType(x, y) {
    if (snake[0].x === x && snake[0].y === y) return "head";
    if (snake.some(seg => seg.x === x && seg.y === y)) return "body";
    if (food.x === x && food.y === y) return "food";
    return "empty";
  }

  return (
    <>
      <Header />
      <main
        className="w-full flex flex-col items-center justify-center bg-black px-2"
        style={{ minHeight: "calc(100vh - 96px)" }}
      >
        <div className="flex flex-col items-center mb-2 mt-5">
          <h2 className="text-[1.25rem] sm:text-2xl font-bold text-center mb-2 tracking-tight text-white drop-shadow-xl">Snake Game</h2>
          <div className="mb-2 text-2xl font-bold text-orange-400 tracking-wider drop-shadow-lg">{score}</div>
        </div>
        <div
          className="mx-auto flex items-center justify-center rounded-[1.2rem] bg-[#232635] border-2 border-[#262a38] relative shadow-xl"
          style={{
            width: BOARD_SIZE * cellSize + 12,
            maxWidth: "95vw",
            height: BOARD_SIZE * cellSize + 12,
            maxHeight: "80vw",
            minWidth: 245,
            minHeight: 245,
            marginBottom: 8,
            padding: 4
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
              gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
              background: "#191b1f",
              borderRadius: 12,
              padding: 2,
              width: "100%",
              height: "100%"
            }}
          >
            {Array.from({ length: BOARD_SIZE }).map((_, y) =>
              Array.from({ length: BOARD_SIZE }).map((_, x) => {
                const type = cellType(x, y);
                return (
                  <div
                    key={x + "," + y}
                    className={
                      `flex items-center justify-center rounded-[3px] border border-[#24283a] transition-all
                      ${type === "body" ? "bg-green-500 shadow-[0_0_8px_1px_#34d399]" : ""}
                      ${type === "head" ? "bg-green-300 shadow-[0_0_12px_1.2px_#fff]" : ""}
                      ${type === "food" ? "bg-orange-500 border-orange-300" : ""}
                      ${type === "empty" ? "bg-black" : ""}
                    `
                    }
                    style={{
                      width: cellSize - 2,
                      height: cellSize - 2
                    }}
                  >
                    {type === "food" && <span className="text-lg">{cellSize > 25 ? "🍎" : "🍏"}</span>}
                  </div>
                );
              })
            )}
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 flex-col rounded-[1rem]">
                <div className="text-3xl font-black text-red-400 mb-2 animate-bounce drop-shadow-lg">
                  Game Over!
                </div>
                <div className="text-lg text-white mb-4">
                  Your score: <span className="font-bold text-orange-400">{score}</span>
                </div>
                <button
                  onClick={restart}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-xl"
                >
                  Restart
                </button>
                <div className="text-xs mt-2 text-gray-300">Nice Game play</div>
              </div>
            )}
          </div>
        </div>
        <div className="text-[14px] sm:text-md mt-4 text-gray-400">
          Use arrow keys!
        </div>
      </main>
    </>
  );
}
