import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SessionWrapper from "./sessionWrapper";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitesN'Click",
  description: "BitesN'Click: A cafe ordering system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
