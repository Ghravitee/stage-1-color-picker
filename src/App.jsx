import { useState, useEffect } from "react";

const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

export default function App() {
  // Game state variables
  const [targetColor, setTargetColor] = useState(""); // The color to guess
  const [options, setOptions] = useState([]); // Available color choices
  const [score, setScore] = useState(0); // Player's score
  const [status, setStatus] = useState(""); // Feedback message (correct/wrong)
  const [hasGuessed, setHasGuessed] = useState(false); // Track if user has guessed
  const [selectedColor, setSelectedColor] = useState(""); // Player's chosen color
  const [round, setRound] = useState(1); // Track the current round
  const [gameOver, setGameOver] = useState(false); // Check if the game has ended
  const [statusClass, setStatusClass] = useState(""); // CSS class for status message effects

  // Start a new game when the component first loads
  useEffect(() => {
    startNewGame();
  }, []);

  // Function to shuffle an array randomly
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Initialize game state
  const startNewGame = () => {
    setRound(1);
    setScore(0);
    setStatus("");
    setStatusClass(""); // Reset status animation
    setHasGuessed(false);
    setSelectedColor("");
    setTargetColor(""); // Hide the target color at the start
    setGameOver(false);
    pickNewOptions(); // Generate a new set of colors
  };

  // Pick a random set of color options
  const pickNewOptions = () => {
    const shuffledColors = shuffleArray([...colors]);
    setOptions(shuffledColors);
  };

  // Handle user guessing a color
  const handleGuess = (color) => {
    if (gameOver) return; // Prevent actions after game ends

    setHasGuessed(true);
    setSelectedColor(color);

    // Pick a new target color from the available options
    const newTargetColor = options[Math.floor(Math.random() * options.length)];
    setTargetColor(newTargetColor);

    // Check if the guess is correct
    if (color === newTargetColor) {
      setStatus("Correct!");
      setStatusClass("correct-status"); // Apply animation effect
      setScore((prev) => prev + 1); // Increase score
    } else {
      setStatus(
        <>
          Wrong! The correct color was{" "}
          <span style={{ color: newTargetColor, fontWeight: "bold" }}>
            {newTargetColor}
          </span>
        </>
      );
      setStatusClass("wrong-status fade-out"); // Apply fade-out effect
    }

    // Remove the status animation after 2 seconds
    setTimeout(() => {
      setStatusClass("");
    }, 2000);

    // Proceed to the next round or end the game
    if (round < 10) {
      setRound((prev) => prev + 1);
      setTimeout(() => {
        setHasGuessed(false);
        pickNewOptions();
      }, 2000);
    } else {
      setGameOver(true);
      setStatus(
        `Game Over! Final Score: ${score + (color === newTargetColor ? 1 : 0)}`
      );
    }
  };

  return (
    <div className="game-container">
      {/* Title with multi-colored letters */}
      <h1 className="colorful-title">
        {["C", "o", "l", "o", "r", " ", "G", "a", "m", "e"].map(
          (char, index) => (
            <span key={index} className={`letter letter-${index}`}>
              {char}
            </span>
          )
        )}
      </h1>

      {/* Game instructions */}
      <h2 data-testid="gameInstructions">
        Guess the correct color from the options. After selecting, the correct
        color is revealed. Earn points for correct guesses. The game ends after
        10 rounds. Restart to play again!
      </h2>

      {/* Display current round number */}
      <p className="round">Round: {round} / 10</p>

      {/* Show guessed color vs actual target color */}
      {hasGuessed && targetColor && (
        <div className="color-comparison">
          <div>
            <div
              className="color-box"
              style={{ backgroundColor: selectedColor }}
              data-testid="colorBox"
            ></div>
            <p>Your Guess</p>
          </div>
          <div>
            <div
              className="color-box"
              style={{ backgroundColor: targetColor }}
              data-testid="colorBox"
            ></div>
            <p>Target Color</p>
          </div>
        </div>
      )}

      {/* Color selection buttons */}
      <div className="options">
        {options.map((color, index) => (
          <button
            key={index}
            style={{
              backgroundColor: color,
              border:
                selectedColor === color
                  ? "4px solid white"
                  : "2px solid transparent",
            }}
            className="color-button"
            onClick={() => handleGuess(color)}
            data-testid="colorOption"
            disabled={gameOver} // Disable buttons if game is over
          ></button>
        ))}
      </div>

      {/* Game status (Correct/Wrong/Game Over) */}
      <p data-testid="gameStatus" className={`status ${statusClass}`}>
        {status}
      </p>

      {/* Display current score */}
      <p data-testid="score" className="score">
        Score: {score}
      </p>

      {/* Restart game button */}
      <button onClick={startNewGame} data-testid="newGameButton">
        {gameOver ? "Restart Game" : "New Game"}
      </button>
    </div>
  );
}
