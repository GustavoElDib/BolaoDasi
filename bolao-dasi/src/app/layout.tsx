import type { Metadata } from "next";
import { Geist, Geist_Mono, Arima, Mulish, Poiret_One } from "next/font/google";
import { Navbar } from "@/components/navbar/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";



const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: ["400"],
});

const arima = Arima({
  variable: "--font-arima",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolão DASI",
  description: "Sistema de palpites para a Copa do Mundo 2026, feito pelo DASI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${arima.variable} ${mulish.variable} ${poiretOne.variable}`}
    >
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}