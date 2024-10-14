import React from "react";
import Rankings from "./pages/Rankings.tsx";
import { supabase } from "./supabase";
import Matches from "./pages/Matches.tsx";
import Header from "./components/Header.tsx";
import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext.tsx";
import Players from "./pages/Players.tsx";
import Footer from "./components/Footer.tsx";

function MainApp() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppProvider>
      {/* Wrapper global avec une hauteur de 100vh */}
      <div className="absolute w-full bg-gray-100 min-h-screen">
        {/* Header fixe */}
        <Header onLogout={handleLogout} />

        {/* Contenu principal avec un padding-top et padding-bottom égale à la taille du header et footer */}
        <div className="flex-grow px-4 pt-16 pb-4 mb-16 mt-8 md:pt-4 md:mt-24 md:mb-0 max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-x-auto overflow-y-auto">
          <Routes>
            <Route path="/" element={<Rankings />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/players" element={<Players />} />
            {/*<Route path="/players/:id" element={<PlayerDetails />} />*/}
          </Routes>
        </div>

        {/* Footer fixe */}
        <Footer />
      </div>
    </AppProvider>
  );
}

export default MainApp;
