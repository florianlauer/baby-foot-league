import React from "react";
import PlayerRanking from "./components/PlayerRanking";
import { supabase } from "./supabase";
import MatchTabContent from "./components/MatchTabContent.tsx";
import NewHeader from "./components/NewHeader.tsx";
import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext.tsx";

function MainApp() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <NewHeader onLogout={handleLogout} />

        <div className="max-w-4xl mt-8 mx-auto bg-white rounded-lg shadow-md p-6">
          <Routes>
            <Route path="/matches" element={<MatchTabContent />} />
            <Route path="/leaderboard" element={<PlayerRanking />} />
          </Routes>
        </div>
      </div>
    </AppProvider>
  );
}

export default MainApp;
