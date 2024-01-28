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

  const [screen, setScreen] = useState("title");

  return (
    <>
      <div
        style={{
          width: "1920px",
          height: "1080px",
          margin: "auto auto",
        }}
      >
        {screen === "title" && (
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
              }}
            >
              <img src="/sprite/title bild.png" alt="title" />
            </div>
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            >
              <button
                onClick={() => {
                  setScreen("game");
                  gameRef.current?.resume();
                }}
              >
                Start
              </button>
            </div>
          </div>
        )}
        {screen === "game" && (
          <div>
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
                  <button onClick={() => gameRef.current?.pause()}>Stop</button>
                  <button onClick={() => gameRef.current?.test()}>Test</button>
                  <button onClick={() => gameRef.current?.reset()}>
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
