import React from "react";
import logo from "../assets/pig-0.png";
import { Link } from "react-router-dom";

// The first page a player sees. One clear "Start game" button leads to the setup page,
// where they choose friends or the computer, the game mode and the sound settings.
export default function Home() {
  return (
    <section className=" w-full min-h-screen flex flex-col justify-center items-center p-4">
      <figure>
        <img src={logo} alt="Greedy Pig logo" width={400} />
      </figure>
      <div className="flex flex-col gap-6 text-[#F9F7E8] text-center">
        <h1 className="pri-font text-3xl sm:text-5xl lg:text-6xl ">
          Greedy Pig
        </h1>
        <p className="text-lg sm:text-xl max-w-[480px]">
          Welcome! Play friends on one screen or take on the computer, in the classic game or the new Even out the Odds mode.
        </p>
        <div className="flex gap-4 flex-col items-center">
          <Link
            to={`/live-game/setup`}
            className=" sec-font text-xl rounded px-8 py-4 bg-[#d30cbcc0] font-bold duration-500 skew-x-6 hover:bg-[#d30cbc] hover:skew-x-0 hover:scale-95 "
          >
            Start game
          </Link>
          <Link
            to={`/live-game/how-to-play`}
            className=" text-lg font-bold underline hover:text-white duration-300"
          >
            How to play
          </Link>
        </div>
      </div>
    </section>
  );
}
