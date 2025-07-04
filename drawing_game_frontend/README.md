# WildSketch Arena – Drawing Game Frontend

A modern, fun, and fully responsive React web app for a drawing and guessing game. Players log in anonymously, draw prompts using the canvas and spin wheel, and guess what others have drawn – all with real-time updates and a beautiful UI.

---

## Features

- **Anonymous Login**: Secure, playful nickname entry via Firebase Auth
- **Dashboard**: Responsive grid of top drawings, live leaderboard, correct/incorrect guess display, and animated card entrances
- **Add Drawing**: Spin wheel animal prompt, with animated canvas and 45s timer, touch & mouse support, and easy upload
- **Guess Logic**: Input your guess for each drawing, result feedback, and live update of wrong/correct guesses
- **Real-Time Updates**: All game data syncs live using Firebase
- **Beautiful UI**: Tailwind CSS styling, Framer Motion transitions, Lucide Icons, and modern brand colors
- **Fully Responsive**: Mobile-first layout, animated modals, and beautiful on all screens

---

## Getting Started

Install dependencies:
```bash
npm install
```

Start the app in development mode (default: http://localhost:3000):
```bash
npm start
```

To build for production:
```bash
npm run build
```

---

## Code Structure

- `/src/firebase.js` – Firebase config and helpers
- `/src/context/` – App-wide Contexts (auth, game state, real-time actions)
- `/src/pages/` – All UI pages (Login, Dashboard, Add Drawing, 404)
- `/src/App.js` – App entrypoint + React Router routes

---

## Styling & Assets

- **Tailwind CSS**: For layout, spacing, color, and typography
- **Framer Motion**: Animate cards, modal, entrances, spin wheel
- **Lucide-react**: Modern icons for UI
- **Fonts**: Uses the Segoe UI/Roboto font stack

---

## Firebase Config

Create a `.env` file with your Firebase config:
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

Alternatively, update `/src/firebase.js` with your project details for quick test runs.

---

## License and Credits

This codebase is for demo and educational purposes.

- Inspired by prompt: "Drawing guessing game, animal spin wheel, Firebase, fun UI"
- Uses React, Tailwind CSS, Firebase, Framer Motion, Lucide Icons.

