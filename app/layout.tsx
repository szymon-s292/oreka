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
  title: "Oreka - Ewa gruszczyńska",
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
