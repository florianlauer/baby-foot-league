import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import MainApp from "./MainApp";
import { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <div className="App">{session ? <MainApp /> : <Auth />}</div>;
}

export default App;
