import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oreka - Projekty domów i audyty energetyczne | Ostrzeszów",
  description: "Gotowe i indywidualne projekty domów, adaptacje projektów, audyty energetyczne, świadectwa charakterystyki energetycznej. Ostrzeszów i powiat ostrzeszowski.",
  keywords: [
    "projekty domów Ostrzeszów",
    "audyt energetyczny Ostrzeszów",
    "charakterystyka energetyczna",
    "adaptacja projektów Ostrzeszów",
    "Czyste Powietrze Ostrzeszów",
    "świadectwo energetyczne Ostrzeszów",
    "projekty budynków Ostrzeszów",
  ],
  authors: [{ name: "Oreka - Ewa Gruszczyńska" }],
  creator: "Oreka - Ewa Gruszczyńska",
  metadataBase: new URL("https://oreka-eg.pl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Oreka - Projekty domów i audyty energetyczne | Ostrzeszów",
    description: "Kompleksowa obsługa projektowa i energetyczna – projekty domów, adaptacje, audyty energetyczne i świadectwa. Działamy w Ostrzeszowie i powiecie ostrzeszowskim.",
    url: "https://oreka-eg.pl",
    siteName: "Oreka",
    locale: "pl_PL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} limit={1} closeOnClick newestOnTop toastClassName={'bg-gray-400'}/>
      </body>
    </html>
  );
}



{/* <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} limit={3} /> */}
{/* </SessionProvider> */}
{/* <SessionProvider session={session}> */}
