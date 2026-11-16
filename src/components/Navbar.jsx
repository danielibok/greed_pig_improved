import React from "react";
import logo from "../assets/pig-0.png";
import { Link, useNavigate } from "react-router-dom";

// The bar at the top of the setup and game screens.
// On the setup page it has a "Home" button back to the home page.
// In a game (showExit), it has an "Exit game" button instead, which asks first,
// so a misclick doesn't throw away a game in progress.
export default function Navbar({ showExit = false }) {
  const navigate = useNavigate();

  function exitGame() {
    if (window.confirm("Leave this game and go back to the home page? This game will end.")) {
      navigate("/");
    }
  }

  return (
    <nav className="sticky top-0 w-full flex justify-between py-2 px-4 md:px-[2%] md:py-[2%] text-white border-b border-b-[#ffffff80] backdrop-blur items-center">
      <a href={`/`} className="flex lg:gap-2 items-center">
        <h1 className="pri-font text-base sm:text-lg md:text-xl lg:text-2xl xl:text-4xl ">
          Greedy Pig
        </h1>

        <img src={logo} alt="logo" width={75} />
      </a>
      <div className="flex items-center gap-4">
      {!showExit && (
        <Link
          to="/"
          className="bg-[#D30CBD80] hover:bg-[#D30CBD] duration-300 text-white font-bold rounded-lg px-3 py-1 md:px-4 md:py-2"
        >
          Home
        </Link>
      )}
      {showExit && (
        <button
          type="button"
          onClick={exitGame}
          className="bg-[#D30CBD80] hover:bg-[#D30CBD] duration-300 text-white font-bold rounded-lg px-3 py-1 md:px-4 md:py-2"
        >
          Exit game
        </button>
      )}
      <Link
        to={`/live-game/how-to-play`}
        className=" text-[#ffffff] hover:underline duration-300 font-bold hidden md:flex"
      >
        How To Play?
      </Link>
      <Link
        to={`/live-game/how-to-play`}
        className=" text-[#ffffff] hover:underline duration-300 font-bold flex text-xl md:hidden"
      >
        ?
      </Link>
      </div>
    </nav>
  );
}
