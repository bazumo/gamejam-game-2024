import { useCallback, useEffect, useRef, useState } from "react";

import { createNewGame, Game } from "./Game/game";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const gameRef = useRef<Game | null>(null);
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return;
    const game = gameRef.current;
    if (!game) return;
    game.setCanvas(canvas);
  }, []);

  useEffect(() => {
    const game = createNewGame();
    setLoading(true);
    game.init().then(() => {
      setLoading(false);
      gameRef.current = game;
    });

    return () => {
      game.pause();
    };
  }, []);

  return (
    <>
      <p>{loading && "LOADING"}</p>
      {gameRef.current && (
        <div>
          <canvas
            id="canvas"
            width="1920"
            height="1080"
            ref={canvasRef}
          ></canvas>
          <div>
            <button onClick={() => gameRef.current?.resume()}>Start</button>
            <button onClick={() => gameRef.current?.pause()}>Stop</button>
            <button onClick={() => gameRef.current?.test()}>Test</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
