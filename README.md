# Greedy Pig Reimagined

A remake of the dice game Greedy Pig for CSC 419 (Advances in Web, Mobile and Blockchain Development), Pan-Atlantic University.

**Play it here:** https://greed-pig-improved.vercel.app

## Group members

| Name              | Matric number | Part                                                                       |
| ----------------- | ------------- | -------------------------------------------------------------------------- |
| Daniel Ibok       | 23120111022   | Backend, database, server rules, deployment and joining the parts together |
| Richard Okelu     | 23120111040   | Even out the Odds game mode                                                |
| Oluseyi Olukogbon | 23120111047   | Accessibility: voice announcer, captions and sound settings                |
| Joachim Okpara    | 24120111125   | Computer opponent with easy, medium and hard                               |

## How to play

On your turn, roll the dice as many times as you like. Every roll adds to your turn total. Roll a 1 and you lose the whole turn total and your turn ends. Press **Hold** to bank your turn total and pass the dice. The first player to reach the target score wins.

## Our three improvements

### 1. Gameplay and rules: Even out the Odds mode

A second way to play, picked on the setup page. At the start of each game the server secretly picks a **special even number** (2 or 4) that scores **double**, and a **special odd number** (3 or 5) that **takes points away**. The numbers are shown under the dice. Your turn total can go below zero, so you can only hold once it is above 0. The default target is 50.

### 2. Computer opponents: difficulty levels

Choose **The computer** on the setup page to play against a bot, at one of three levels:

- **Easy** holds early, at a random point between 5 and 15, so it is beatable.
- **Medium** uses the classic "hold at 20" strategy.
- **Hard** watches the scoreboard: it plays safer when ahead, takes more risk when behind, and keeps rolling if you are about to win.

The computer's turn is played on the server, so it can't be tampered with, and the screen replays each roll with a short pause.

### 3. Accessibility: voice and captions

- A **voice announcer** reads every move out loud ("Iggy rolled a 5. Turn total 8.") using the browser's built-in speech.
- A **caption bar** shows the same sentence, and screen readers read it out automatically (`aria-live`).
- A **Sound settings** panel on the setup page has switches for sound effects and the voice, a volume slider and a Test voice button. It works with the keyboard and is remembered on the device.

## Backend

Dice rolls and scores are worked out on the server, not in the browser, so players can't cheat. Games, players and every move are saved in a Postgres database (Neon).

| Endpoint                       | What it does                                                               |
| ------------------------------ | -------------------------------------------------------------------------- |
| `POST /api/games`              | Starts a new game (checks names, number of players, target score and mode) |
| `GET /api/games/:id`           | Gets the current state of a game                                           |
| `POST /api/games/:id/roll`     | Rolls the dice on the server for the current player                        |
| `POST /api/games/:id/hold`     | Banks the turn total and passes the turn                                   |
| `POST /api/games/:id/bot-turn` | Plays the computer's whole turn                                            |
| `GET /api/health`              | Checks the server and database are up                                      |

Every request is validated, and the server refuses moves that aren't allowed (for example, holding before rolling, playing out of turn, or moving after the game has ended).

## Tech used

React 18, Vite, Tailwind CSS and React Router for the frontend. Vercel serverless functions for the API. Neon Postgres for the database. Hosted on Vercel.

## How to run it yourself

You need Node.js 22 and a free Neon (Postgres) database.

1. Clone the repo and install packages:

   ```
   git clone https://github.com/danielibok/greed_pig_improved.git
   cd greed_pig_improved
   npm install
   ```

2. Create a file called `.env.local` with your database link:

   ```
   DATABASE_URL=postgres://...your Neon connection string...
   ```

3. Create the database tables: `npm run db:setup`
4. Start the game and the API together: `npx vercel dev`, then open http://localhost:3000
5. Run the rule tests: `npm run test:rules` and `node shared/bot.test.js`

`npm run dev` starts only the frontend, so starting a game needs the API from step 4.

## Credits

Based on the original Greedy Pig by Hemephelus: https://github.com/Hemephelus/greed_pig
