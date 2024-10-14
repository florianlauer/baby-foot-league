import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, List } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="flex bg-green-700 text-white fixed bottom-0 left-0 right-0 h-16 z-10 md:hidden">
      <nav className="container mx-auto px-4 py-2">
        <ul
          className="flex justify-around items-center"
          style={{ height: "100%" }}
        >
          <li>
            <Link
              to="/players"
              className="flex flex-col items-center hover:text-blue-200"
            >
              <Users size={24} />
              <span className="text-xs">Players</span>
            </Link>
          </li>
          <li>
            <Link
              to="/matches"
              className="flex flex-col items-center hover:text-blue-200"
            >
              <List size={24} />
              <span className="text-xs">Matches</span>
            </Link>
          </li>
          <li>
            <Link
              to="/rankings"
              className="flex flex-col items-center hover:text-blue-200"
            >
              <Trophy size={24} />
              <span className="text-xs">Rankings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
