import { useCallback, useEffect, useRef, useState } from "react";

import { createNewGame, Game } from "./Game/game";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("title");

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
      game.screenChangeFunction = setScreen;
      gameRef.current = game;
    });

    return () => {
      game.pause();
    };
  }, []);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.screenChangeFunction = setScreen;
    }
  }, [setScreen]);

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
              <img src="/sprite/screen and button/title bild.png" alt="title" />
            </div>

            <img
              style={{
                position: "absolute",
                top: "200px",
                right: "100px",
              }}
              className="button"
              src="/sprite/screen and button/titlr play button.png"
              alt="start"
              onClick={() => {
                setScreen("game");
                gameRef.current?.resume();
              }}
            ></img>

            <img
              style={{
                position: "absolute",
                top: "100px",
                left: "100px",
              }}
              className="button"
              src="/sprite/screen and button/titlr credit button.png"
              alt="start"
              onClick={() => {
                setScreen("credits");
              }}
            ></img>
          </div>
        )}

        {screen === "credits" && (
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
              <img
                src="/sprite/screen and button/credit bild.png"
                alt="title"
              />
            </div>
            <img
              style={{
                position: "absolute",
                top: "200px",
                right: "100px",
              }}
              className="button"
              src="/sprite/screen and button/credit button.png"
              alt="start"
              onClick={() => {
                window.location.reload();
              }}
            ></img>
          </div>
        )}

        {screen === "lose" && (
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
              <img src="/sprite/screen and button/you suck.png" alt="title" />
            </div>
            <img
              style={{
                position: "absolute",
                top: "200px",
                right: "100px",
              }}
              className="button"
              src="/sprite/screen and button/credit button.png"
              alt="start"
              onClick={() => {
                window.location.reload();
              }}
            ></img>
          </div>
        )}

        {screen === "win" && (
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
              <img src="/sprite/screen and button/good job.png" alt="title" />
            </div>
            <img
              style={{
                position: "absolute",
                top: "200px",
                right: "100px",
              }}
              className="button"
              src="/sprite/screen and button/credit button.png"
              alt="start"
              onClick={() => {
                window.location.reload();
              }}
            ></img>
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
                <div></div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
