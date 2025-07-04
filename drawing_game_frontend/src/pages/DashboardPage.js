import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LucidePalette, LucideLogOut } from "lucide-react";

function DrawingCard({ drawing, makeGuess, guessingDisabled }) {
  const [guess, setGuess] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);

  const user = useAuth().user || {};

  const hasGuessed = drawing.guesses?.some(g => g.userId === user.uid);
  const myGuess = drawing.guesses?.find(g => g.userId === user.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await makeGuess(drawing.id, guess.trim());
      setShowResult(true);
      setTimeout(() => setShowResult(false), 1500);
    } catch (err) {
      setError("Error submitting guess.");
    }
    setSubmitting(false);
    setGuess("");
  };

  // Drawing image sanity: handle missing/invalid URLs
  let imgUrl = drawing.url || "";
  if (imgUrl.startsWith("data:")) {
    // ok
  } else if (imgUrl && !imgUrl.startsWith("http")) {
    imgUrl = "";
  }

  return (
    <motion.div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center p-3 transition border-4 ${hasGuessed && myGuess?.correct ? 'border-green-400' : hasGuessed ? 'border-yellow-400' : 'border-gray-200'} h-full`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <img
        src={imgUrl || "/assets/placeholder.png"}
        alt="drawing"
        className="object-contain rounded-md max-h-40 w-full bg-gradient-to-br from-secondary/50 to-primary/10"
        loading="lazy"
      />
      <div className="flex-1 w-full pt-2 flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">By: {drawing.author || "Anon"}</div>
          <div className="text-xs text-right text-gray-400">⏱ {((Date.now() - (drawing.createdAt?.toMillis?.() || 0))/1000/60).toFixed(0)}m ago</div>
        </div>
        <AnimatePresence>
          {!hasGuessed && (
            <motion.form
              className="flex flex-col gap-2 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
            >
              <input
                value={guess}
                type="text"
                className="border rounded px-2 py-1 text-sm focus:border-primary focus:outline-none"
                placeholder="Type your guess!"
                onChange={e => setGuess(e.target.value)}
                disabled={submitting || guessingDisabled}
              />
              <button
                type="submit"
                className="bg-primary text-white font-semibold rounded py-1 hover:bg-blue-700 transition"
                disabled={submitting || guessingDisabled}
              >
                Guess
              </button>
              {error && <span className="text-xs text-red-500">{error}</span>}
            </motion.form>
          )}
          {hasGuessed && (
            <motion.div
              className="text-center p-2 mt-2 font-bold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {myGuess?.correct
                ? <span className="text-green-600">🎉 Correct!</span>
                : <span className="text-yellow-600">❌ Wrong (was: {drawing.prompt})</span>}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-2">
          <div className="text-sm font-semibold">Guesses:</div>
          <ul className="text-xs flex flex-wrap gap-2 mt-1">
            {(drawing.guesses || []).slice(-5).reverse().map((g, idx) =>
              <li
                key={idx}
                className={`px-2 py-0.5 rounded ${g.correct ? "bg-green-200 text-green-800" : "bg-yellow-100 text-yellow-900"}`}
              >
                {g.userName || "Anon"}: {g.guess}
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardPage() {
  const { drawings, loading, error, submitGuess, getLeaderboard } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddDrawing = () => navigate("/add");

  // Get the best/top drawing
  const leaderboard = getLeaderboard(drawings);
  const topDrawing = leaderboard[0];
  const gridDrawings = leaderboard.slice(1, 13); // display up to 12 in grid

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary">
      <header className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-4">
          <LucidePalette className="text-primary" size={32} />
          <span className="text-2xl font-semibold text-primary">WildSketch Arena</span>
        </div>
        <div className="text-sm text-gray-700 flex flex-col items-end">
          Welcome, <span className="font-bold">{user?.displayName}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading && <div>Loading drawings...</div>}
        {error && <div className="text-red-600">{error}</div>}
        
        {/* TOP Drawing */}
        {topDrawing &&
          <motion.div
            className="mb-8"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 13 }}
          >
            <div className="bg-gradient-to-r from-primary/20 to-green-100 border-2 border-primary/30 rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3 items-center">
              <img src={topDrawing.url} alt="Top drawing" className="rounded h-36 w-36 object-contain bg-white shadow" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-green-700 font-semibold text-lg">🌟 Top Drawing!</div>
                <div>By <span className="font-semibold">{topDrawing.author || "Anon"}</span></div>
                <div>
                  <span className="text-primary font-bold">{topDrawing.guesses?.filter(g => g.correct).length}</span> correct guesses
                </div>
              </div>
            </div>
          </motion.div>
        }

        <h3 className="text-xl font-bold mb-4 text-primary">Recent Drawings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {gridDrawings.map((drawing) =>
              <DrawingCard
                key={drawing.id}
                drawing={drawing}
                makeGuess={submitGuess}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      {/* Floating Add Drawing Button */}
      <button
        onClick={handleAddDrawing}
        className="fixed bottom-8 right-8 z-50 bg-primary/90 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center animate-bounce hover:scale-110 transition"
        aria-label="Add Drawing"
        style={{boxShadow: "0 6px 24px 0 rgba(93,145,233,0.3)"}}
      >
        <LucidePalette size={36} />
      </button>
    </div>
  );
}

export default DashboardPage;
