import type { Metadata } from "next";
// import { Inter, Bungee_Spice, Londrina_Shadow } from "next/font/google";
import "./globals.css";
import "@/styles/animalButtons.css";
// import "../styles/shapegame.css";
// import "../styles/characterBase.css";
// import "../styles/curriculumPage.css";


import { Inter, Bungee_Spice, Londrina_Shadow } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const bungeeSpice = Bungee_Spice({ 
  weight: "400", 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-bungee-spice',
});
const londrinaShadow = Londrina_Shadow({
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-londrina-shadow',
});


export const metadata: Metadata = {
  title: 'Koda World',
  description: 'Learn and explore with Koda World',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${bungeeSpice.variable} ${londrinaShadow.variable}`}>{children}</body>
    </html>
  );
}