# Kenyan Poker (Kadi) 🃏

A React-based web application that simulates the popular Kenyan card game **"Kadi"**. This project features a single-player mode where a human player competes against a computer opponent using strict Kadi rules, including penalty stacking and special power cards.


##  Features

- **Single Player vs. AI(Computer):** Play against a computer opponent that follows game logic to make valid moves.
- **Strict Kadi Rules:** Implements core mechanics like:
  - **Question Cards (Q, 8):** Must be answered immediately.
  - **Penalty Cards (2, 3, Joker):** Forces the opponent to draw cards (stackable).
  - **Jump (J) & Kickback (K):** Skips the opponent's turn.
- **"Niko Kadi" Declaration:** Players must declare "Niko Kadi" when they have one card left to win.
- **Responsive Design:** Fully responsive UI that works on desktops and mobile devices.
- **Smooth Animations:** Visual feedback for card plays, shuffling, and turns.

## 🛠️ Tech Stack

- **Frontend Library:** React (v19)
- **Build Tool:** Vite
- **Routing:** React Router DOM (v7)
- **Styling:** CSS3 (Grid & Flexbox)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, Custom Hooks)

## 📂 Project Structure

The project follows a modular, industry-standard architecture:

```text
src/
├── components/       # Reusable UI blocks (Hands, Buttons, Card Display)
├── hooks/            # Custom Hooks (useKadiDeck.js for deck logic)
├── pages/            # Main Route Views (Home, GameBoard, Rules)
├── utils/            # Pure JavaScript Game Logic (Rules, Validation, AI)
├── App.jsx           # Main Router Setup
└── main.jsx          # Entry Point