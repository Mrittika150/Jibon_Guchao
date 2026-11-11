import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {queryClient} from "../lib/queryClient"

// undefined = still checking, null = signed out, Session = signed in
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      if(event === "SIGNED_OUT"){
        queryClient.clear();
      }
      setSession(newSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return session;
}