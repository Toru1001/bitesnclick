"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Session } from "@supabase/supabase-js";
import PageHeader from "@/app/components/header/pageHeader";
import { ClipLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import AdminSidebar from "./admin/admin-components/admin-sidebar";
import AuthComponent from "./login/admin/page";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setSession(data.session);
      }
      setLoading(false);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#E19517" size={50} />
      </div>
    );
  } else {
    setTimeout(() => {
      if (!navigator.onLine) {
        alert("No internet connection.");
        window.location.reload();
      }
    }, 6000);
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname.startsWith("/login");

  if (isLoginPath) {
    return <AuthComponent />;
  }

  return (
    <>
      {isAdminPath ? (
        <AdminSidebar />
      ) : (
        <PageHeader session={session} setSession={setSession} />
      )}
      <main>{children}</main>
    </>
  );
}
