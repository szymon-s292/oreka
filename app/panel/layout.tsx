import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { SessionProvider } from "next-auth/react";
import Menu from "@/app/ui/dashboard-menu"

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session)
    redirect('/login')

  return (
    <SessionProvider session={session}>
      <main className="flex h-screen bg-gray-100 font-sans text-gray-800">
        <Menu/>  
        <section className="w-full max-w-screen mt-8 md:mt-0 flex-1 overflow-auto">
          {children}
        </section>
      </main>
    </SessionProvider>
  );
}
  