import React from "react";
import logo from "src/assets/pig-0.png";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import BackButton from "src/components/BackButton";

// One card on the How to Play page.
function Card({ title, children }) {
  return (
    <section className="backdrop:blur bg-[#ffffff10] px-8 lg:px-12 py-6 border text-base lg:text-xl rounded-lg">
      {title && <h2 className="text-lg lg:text-2xl font-bold mb-2">{title}</h2>}
      {children}
    </section>
  );
}

export default function HowToPlay() {
  return (
    <div className="p-[5%] flex flex-col relative w-full items-center ">
      <nav className="fixed top-0 w-full flex justify-between p-[5%]">
        <BackButton />
        <Link
          to="/"
          aria-label="Home"
          className=" bg-[#D30CBD80] hover:bg-[#D30CBD] duration-300 text-white w-[48px] h-[48px] border rounded-full flex items-center justify-around"
        >
          <AiFillHome size={24} />
        </Link>
      </nav>
      <div className="flex flex-col items-center gap-6 lg:gap-12 md:max-w-[70%] xl:max-w-[55%]">
        <figure>
          <img src={logo} alt="Greedy Pig logo" width={400} />
        </figure>

        <section className="text-white space-y-4 w-full">
          <h1 className="pri-font text-2xl lg:text-4xl">GAME SETUP</h1>
          <Card>
            <ol className="list-decimal space-y-2 pl-4">
              <li>Choose who you play against: <b>Friends</b> on the same screen, or <b>The computer</b> (pick Easy, Medium or Hard).</li>
              <li>Choose a game mode: <b>Classic</b> or <b>Even out the Odds</b>.</li>
              <li>Set the score needed to win, and type the players' names.</li>
              <li>Turn the voice and sound effects on or off in the <b>Sound</b> box, then press <b>Play</b>.</li>
            </ol>
          </Card>
        </section>

        <section className="text-white space-y-4 w-full">
          <h1 className="pri-font text-2xl lg:text-4xl">CLASSIC RULES</h1>
          <Card>
            <ol className="list-decimal space-y-2 pl-4">
              <li>On your turn, roll the dice as many times as you like. Each roll is added to your <b>turn total</b>.</li>
              <li>Roll a <b>1</b> and you lose your whole turn total, and the next player goes.</li>
              <li>Press <b>Hold</b> to bank your turn total and pass the dice. You must roll at least once first.</li>
              <li>The first player to reach the target score (100 unless you change it) wins.</li>
            </ol>
          </Card>
        </section>

        <section className="text-white space-y-4 w-full">
          <h1 className="pri-font text-2xl lg:text-4xl">EVEN OUT THE ODDS</h1>
          <Card>
            <ul className="list-disc space-y-2 pl-4">
              <li>At the start, the game picks a <b>special even number</b> (2, 4 or 6) that scores <b>double</b>.</li>
              <li>It also picks a <b>special odd number</b> (3 or 5) that <b>takes points away</b>, so your turn total can drop below zero.</li>
              <li>A <b>1</b> is still a bust. The special numbers are shown under the dice.</li>
              <li>You can only hold when your turn total is above 0. The default target is 50.</li>
            </ul>
          </Card>
        </section>

        <section className="text-white space-y-4 w-full">
          <h1 className="pri-font text-2xl lg:text-4xl">PLAYING THE COMPUTER</h1>
          <Card>
            <ul className="list-disc space-y-2 pl-4">
              <li><b>Easy</b> plays nervously and banks small amounts.</li>
              <li><b>Medium</b> holds once it has 20 points in a turn.</li>
              <li><b>Hard</b> plays safe when it's ahead, takes risks when it's behind, and won't stop if you're about to win.</li>
              <li>The dice is locked while the computer takes its turn, so you can watch each roll.</li>
            </ul>
          </Card>
        </section>

        <section className="text-white space-y-4 w-full">
          <h1 className="pri-font text-2xl lg:text-4xl">VOICE AND CAPTIONS</h1>
          <Card>
            <p>Every roll is read out loud and shown as a caption above the scores, so you can follow the game by listening or by reading. Screen readers announce the captions too. Change the voice, sound effects and volume in the Sound box on the setup page.</p>
          </Card>
        </section>

        <section className="text-white space-y-4 w-full">
          <h1 className="pri-font text-2xl lg:text-4xl">About</h1>
          <Card>
            <ul className="list-disc space-y-2 pl-4">
              <li>Greedy Pig Reimagined was made for CSC 419 by Daniel Ibok, Richard Okelu, Oluseyi Olukogbon and Joachim Okpara.</li>
              <li>It is built on the original Greedy Pig by <b>Nwachukwu Ujubuonu</b>, designed by <b>Oluwatomisin Rhema Eghosa Odukoya</b> and <b>Alozie Blessed Chuebuka</b>.</li>
              <li>Built with React, Vite, Vercel and a Postgres database.</li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}
