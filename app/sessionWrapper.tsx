"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Session } from "@supabase/supabase-js";
import PageHeader from "@/app/components/header/pageHeader";
import { ClipLoader } from "react-spinners";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./admin/admin-components/admin-sidebar";
import AuthComponent from "./login/admin/page";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

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

  // Admin route guard with expiration
  useEffect(() => {
    const isAdminPath = pathname.startsWith("/admin");
    const rawAdminData = localStorage.getItem("admin_id");

    if (isAdminPath) {
      if (!rawAdminData) {
        router.replace("/login/admin");
        return;
      }

      try {
        const adminData = JSON.parse(rawAdminData);
        if (!adminData.expiresAt || Date.now() > adminData.expiresAt) {
          localStorage.removeItem("admin_id");
          router.replace("/login/admin");
        }
      } catch (err) {
        localStorage.removeItem("admin_id");
        router.replace("/login/admin");
      }
    }
  }, [pathname, router]);

  // Internet connection check
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!navigator.onLine) {
        alert("No internet connection.");
        window.location.reload();
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  // Check and update expired vouchers
  useEffect(() => {
    const checkAndExpireVouchers = async () => {
      const { data: vouchers, error } = await supabase
        .from("vouchers")
        .select("voucherid, end_date, status");

      if (error) {
        console.error("Failed to fetch vouchers:", error);
        return;
      }

      if (vouchers) {
        const currentDate = new Date().toISOString();

        const expiredVoucherIds = vouchers
          .filter((voucher) => new Date(voucher.end_date) < new Date(currentDate) && voucher.status !== "expired")
          .map((voucher) => voucher.voucherid);

        if (expiredVoucherIds.length > 0) {
          const { error: updateError } = await supabase
            .from("vouchers")
            .update({ status: "expired" })
            .in("voucherid", expiredVoucherIds);

          if (updateError) {
            console.error("Failed to update expired vouchers:", updateError);
          } else {
            console.log(`Updated ${expiredVoucherIds.length} expired vouchers.`);
          }
        }
      }
    };

    checkAndExpireVouchers();
  }, []);

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname.startsWith("/login");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#E19517" size={50} />
      </div>
    );
  }

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
