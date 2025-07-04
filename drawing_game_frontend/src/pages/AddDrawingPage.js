import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { motion } from "framer-motion";
import { LucideArrowLeft, LucideLoader, LucideBaby } from "lucide-react";

const promptList = [
  "Lion", "Penguin", "Turtle", "Peacock", "Eagle", "Rabbit",
  "Giraffe", "Shark", "Alligator", "Wolf", "Horse", "Hawk",
  "Panda", "Owl", "Camel", "Dolphin", "Kangaroo", "Parrot",
];

function getRandomPrompt() {
  return promptList[Math.floor(Math.random() * promptList.length)];
}

function DrawingCanvas({ onDrawingSubmit, timer }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // Timer for session
  const [timeLeft, setTimeLeft] = useState(timer);
  React.useEffect(() => {
    if (timeLeft === 0) {
      handleDone();
      return;
    }
    const interval = setInterval(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [timeLeft]);

  // Drawing state
  React.useEffect(() => {
    const canvas = canvasRef.current;
    let drawingCtx = canvas.getContext("2d");
    let lastX = 0; let lastY = 0;
    let drawing = false;

    function pointerDown(e) {
      drawing = true;
      [lastX, lastY] = pointerLoc(e, canvas);
    }

    function pointerMove(e) {
      if (!drawing) return;
      const [x, y] = pointerLoc(e, canvas);
      drawingCtx.beginPath();
      drawingCtx.moveTo(lastX, lastY);
      drawingCtx.lineTo(x, y);
      drawingCtx.strokeStyle = "#5d91e9";
      drawingCtx.lineWidth = 4;
      drawingCtx.lineCap = "round";
      drawingCtx.stroke();
      [lastX, lastY] = [x, y];
    }

    function pointerUp() {
      drawing = false;
    }

    function pointerLoc(e, canvas) {
      let rect = canvas.getBoundingClientRect();
      let ex = e.touches ? e.touches[0].clientX : e.clientX;
      let ey = e.touches ? e.touches[0].clientY : e.clientY;
      return [ex - rect.left, ey - rect.top];
    }

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);

    // mobile
    canvas.addEventListener("touchstart", pointerDown, { passive: false });
    canvas.addEventListener("touchmove", pointerMove, { passive: false });
    window.addEventListener("touchend", pointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("touchstart", pointerDown);
      canvas.removeEventListener("touchmove", pointerMove);
      window.removeEventListener("touchend", pointerUp);
    };
  }, []);

  // PUBLIC_INTERFACE
  function handleDone() {
    const canvas = canvasRef.current;
    onDrawingSubmit(canvas.toDataURL("image/png"));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        className="border-2 border-primary rounded bg-white mb-3 shadow-lg touch-none"
        style={{ touchAction: "none" }}
        data-testid="drawing-canvas"
      />
      <div className="flex gap-3 mb-2">
        <button onClick={handleClear} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Clear</button>
        <button onClick={handleDone} className="text-sm px-3 py-1 bg-primary text-white rounded hover:bg-blue-700">Done</button>
      </div>
      <div className="flex items-center font-mono">
        Time left: <span className="ml-2 text-primary font-bold text-lg">{timeLeft}s</span>
      </div>
    </div>
  );
}

function AddDrawingPage() {
  const { user } = useAuth();
  const { addDrawing } = useGame();
  const [step, setStep] = useState(0); // 0: prompt, 1: draw, 2: upload
  const [prompt, setPrompt] = useState(getRandomPrompt());
  const [drawingUrl, setDrawingUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const navigate = useNavigate();

  function handleSpin() {
    setShowSpin(true);
    setTimeout(() => {
      setPrompt(getRandomPrompt());
      setShowSpin(false);
    }, 900);
  }

  async function handleUploadDrawing() {
    setIsUploading(true);
    try {
      await addDrawing({
        url: drawingUrl,
        prompt: prompt,
        author: user?.displayName,
        authorId: user?.uid,
        createdAt: new Date(),
        guesses: []
      });
      navigate("/");
    } catch {
      alert("Failed to save drawing.");
    }
    setIsUploading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/5 pt-8 pb-20 flex flex-col items-center"
    >
      <div className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-6">
        <button className="text-primary hover:text-blue-700 flex items-center mb-3 font-semibold" aria-label="Back to Dashboard" onClick={() => navigate("/")}>
          <LucideArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-xl font-bold text-accent">Add a Drawing</h2>

        {step === 0 &&
          (
            <div className="flex flex-col items-center gap-2 py-4">
              <motion.div
                className="relative inline-flex items-center rounded-full border-4 border-primary px-7 py-4 bg-gradient-to-tr from-secondary to-primary/10 shadow-lg"
                animate={showSpin ? { rotate: 360 } : { rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <LucideBaby className="text-primary mr-3" size={30} />
                <span className="text-2xl font-mono font-extrabold">{prompt}</span>
              </motion.div>
              <button
                className="mt-6 bg-primary text-white rounded px-6 py-2 font-bold text-xl shadow hover:scale-105 active:scale-95 transition"
                onClick={handleSpin}
                disabled={showSpin}
              >
                {showSpin ? "Spinning..." : "Spin Animal"}
              </button>
              <button
                className="mt-3 underline text-primary text-sm"
                onClick={() => setStep(1)}
              >
                Draw {prompt}
              </button>
            </div>
          )
        }

        {step === 1 &&
          <DrawingCanvas
            timer={45}
            onDrawingSubmit={(url) => { setDrawingUrl(url); setStep(2); }}
          />
        }

        {step === 2 &&
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-bold text-lg mb-1 text-primary">Preview & Upload</h3>
            <img src={drawingUrl} alt="drawing-preview" className="w-72 h-72 border rounded shadow-lg bg-gray-50 object-contain" />
            <button
              onClick={handleUploadDrawing}
              className={`bg-primary text-white rounded px-8 py-2 font-bold text-lg hover:bg-blue-700 transition active:scale-95 ${isUploading && "opacity-50 pointer-events-none"}`}
              disabled={isUploading}
            >
              {isUploading ? <div className="flex items-center gap-2"><LucideLoader className="animate-spin" />Uploading...</div> : "Upload & Share"}
            </button>
          </div>
        }
      </div>
    </motion.div>
  );
}

export default AddDrawingPage;
