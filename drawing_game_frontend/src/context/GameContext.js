import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeError, setRealtimeError] = useState("");

  // Real-time drawings list
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "drawings"), orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setDrawings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, err => setRealtimeError(err.message));
    return () => unsub();
  }, []);

  // PUBLIC_INTERFACE
  const addDrawing = async (drawing) => {
    return await addDoc(collection(db, "drawings"), drawing);
  };

  // PUBLIC_INTERFACE
  const submitGuess = async (drawingId, guess) => {
    if (!user) return;
    const drawingRef = doc(db, "drawings", drawingId);
    const snapshot = await getDoc(drawingRef);
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    let guesses = data.guesses || [];
    guesses = [...guesses, { userId: user.uid, userName: user.displayName, guess, correct: (guess.toLowerCase() === (data.prompt || "").toLowerCase()) }];
    await updateDoc(drawingRef, { guesses: guesses });
    return guesses;
  };

  // PUBLIC_INTERFACE
  const getLeaderboard = (drawings) => {
    // Returns drawings with most correct_guesses at the top
    return (drawings || []).slice().sort((a, b) => (b.guesses?.filter(g => g.correct).length || 0) - (a.guesses?.filter(g => g.correct).length || 0));
  };

  const value = {
    drawings,
    loading,
    error: realtimeError,
    addDrawing,
    submitGuess,
    getLeaderboard
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
