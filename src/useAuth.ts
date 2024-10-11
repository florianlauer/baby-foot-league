import { useEffect, useState } from "react";

import { supabase } from "./supabase.ts";
import { jwtDecode } from "jwt-decode";

interface UserRole {
  isAdmin: boolean;
}

export const useAuth = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession();

    session.then(({ data }) => {
      const { session } = data;
      if (session) {
        const token = session.access_token;

        try {
          const decoded: any = jwtDecode(token);
          // Assumons que le rôle est stocké dans un champ "role" dans le token
          const isAdmin = Boolean(decoded.app_metadata.admin);
          setUserRole({ isAdmin });
        } catch (error) {
          console.error("Error decoding token:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
  }, []);

  return { userRole, loading };
};
