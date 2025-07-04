import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LucidePalette, LucideSmile, LucideUsers } from "lucide-react";
import './index.css';
import './App.css';

import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";

const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const AddDrawingPage = React.lazy(() => import("./pages/AddDrawingPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="font-sans bg-secondary min-h-screen text-primary">
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  } />
                  <Route path="/add" element={
                    <RequireAuth>
                      <AddDrawingPage />
                    </RequireAuth>
                  } />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </Router>
        </div>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
