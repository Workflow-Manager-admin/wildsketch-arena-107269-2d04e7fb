import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideAlertTriangle } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-secondary"
    >
      <div className="bg-white p-8 rounded-xl shadow flex flex-col items-center">
        <LucideAlertTriangle size={40} className="text-red-400 mb-3" />
        <h2 className="font-bold text-2xl mb-2">404 – Page Not Found</h2>
        <button
          className="mt-4 bg-primary text-white px-6 py-2 rounded font-bold"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </motion.div>
  );
}

export default NotFoundPage;
