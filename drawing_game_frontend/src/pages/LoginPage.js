import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LucideSmile } from "lucide-react";

function LoginPage() {
  const { user, loading, login } = useAuth();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname.trim().length < 2) {
      setError("Pick a fun nickname (2+ chars)!");
      return;
    }
    try {
      await login(nickname);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please retry.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-primary to-secondary">
      <motion.div
        className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center mb-6">
          <LucideSmile size={40} className="text-primary mb-3"/>
          <h2 className="text-3xl font-bold mb-1">Welcome to WildSketch Arena!</h2>
          <p className="text-gray-600">Enter a nickname to start playing anonymously:</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border border-gray-200 rounded px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Your fun nickname"
            disabled={loading}
            autoFocus
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            className="bg-primary text-white rounded px-4 py-2 font-bold text-lg hover:bg-blue-700 transition active:scale-95"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging you in..." : "Play Anonymously"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
