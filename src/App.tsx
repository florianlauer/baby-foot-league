import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import MainApp from "./MainApp";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState<boolean>(true); // Nouvel état pour le chargement

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie si une session active existe
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false); // Fin du chargement
    };

    checkSession();

    // Rediriger après la vérification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
      setLoading(false); // Fin du chargement
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Si le chargement est en cours, ne pas rediriger
  if (loading) {
    return <div>Loading...</div>; // Affiche un écran de chargement ou un composant
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />{" "}
      <Route
        path="/*"
        element={isLoggedIn ? <MainApp /> : <Navigate to="/login" />}
      />
      {/* Ajoute d'autres routes selon les besoins */}
    </Routes>
  );
}

export default App;
