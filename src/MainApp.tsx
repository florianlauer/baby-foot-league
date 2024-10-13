import React from "react";
import Rankings from "./pages/Rankings.tsx";
import { supabase } from "./supabase";
import Matches from "./pages/Matches.tsx";
import NewHeader from "./components/NewHeader.tsx";
import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext.tsx";
import Players from "./pages/Players.tsx";

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
            <Route path="/matches" element={<Matches />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/players" element={<Players />} />
            {/*<Route path="/players/:id" element={<PlayerDetails />} />*/}
          </Routes>
        </div>
      </div>
    </AppProvider>
  );
}

export default MainApp;
