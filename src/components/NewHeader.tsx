import React from "react";
import { Link } from "react-router-dom";
import { List, LogOut, Trophy, Users } from "lucide-react";

const NewHeader = ({ onLogout }: { onLogout: VoidFunction }) => {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy size={32} />
          <span className="text-xl font-bold">Baby Foot League</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="flex items-center hover:text-green-200">
                <Users className="mr-1" /> Players
              </Link>
            </li>
            <li>
              <Link
                to="/matches"
                className="flex items-center hover:text-green-200"
              >
                <List className="mr-1" /> Matches
              </Link>
            </li>
            <li>
              <Link
                to="/rankings"
                className="flex items-center hover:text-green-200"
              >
                <Trophy className="mr-1" /> Rankings
              </Link>
            </li>
            <li>
              <Link
                to={""}
                onClick={onLogout}
                className="flex items-center hover:text-green-200"
              >
                <LogOut className="mr-1" />
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NewHeader;
