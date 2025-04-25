import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiHome, FiMail, FiFolder, FiGrid, FiUsers, } from "react-icons/fi";
import { authOptions } from "../auth";
import Logout from "../ui/logout";

const navItems = [
  { id: 0, href: "/panel", label: "Panel główny", icon: <FiHome size={18} className="mr-2" /> },
  { id: 1, href: "/panel/contacts", label: "Próby kontaktu", icon: <FiMail size={18} className="mr-2" /> },
  { id: 2, href: "/panel/categories", label: "Kategorie projektów", icon: <FiFolder size={18} className="mr-2" /> },
  { id: 3, href: "/panel/projects", label: "Projekty", icon: <FiGrid size={18} className="mr-2" /> },
  { id: 4, href: "/panel/userinfo", label: "Twoje informacje", icon: <FiUsers size={18} className="mr-2" /> },
];

export default async function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  if (!session)
    redirect('/login')

  return (
    <main className="flex h-screen bg-gray-100 font-sans text-gray-800">
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-center">
          <Link href="/">
            <Image src="/oreka-logo.png" width={150} height={80} alt="logo" className="rounded-md"/>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <ul>
            {navItems.map(item => {
              return (
                <Link key={item.id} href={item.href}>
                  {/* apply this style  when link is active */}
                  <li className={`w-full flex items-center px-4 py-2 cursor-pointer rounded-lg my-2 text-sm transition ${!item.href ? 'bg-blue-400 text-white font-semibold' : 'text-black hover:bg-gray-200 font-normal'}`}>{item.icon} {item.label}</li>
                </Link>
              )
            })}
            </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Logout/>
        </div>
      </aside>
      <section className="w-full max-w-screen flex-1 p-8 overflow-auto">
        {children}
      </section>
    </main>
  );
}
  