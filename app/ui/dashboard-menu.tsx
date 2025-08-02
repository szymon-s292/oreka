'use client'

import Link from "next/link"
import Image from "next/image"
import { FiHome, FiMail, FiFolder, FiGrid, FiUsers, FiX, FiMenu, FiUser, FiBarChart2 } from "react-icons/fi";
import Logout from "../ui/logout";
import { useState, useEffect } from "react";
import { FaRegEdit, } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Menu() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const path = usePathname()

    const navItems = [
        { id: 0, href: "/panel", label: "Panel główny", icon: <FiHome size={18} className="mr-2" /> },
        { id: 5, href: "/panel/articles", label: "Artykuły", icon: <FaRegEdit size={18} className="mr-2" /> },
        { id: 1, href: "/panel/contacts", label: "Próby kontaktu", icon: <FiMail size={18} className="mr-2" /> },
        { id: 2, href: "/panel/categories", label: "Kategorie projektów", icon: <FiFolder size={18} className="mr-2" /> },
        { id: 3, href: "/panel/projects", label: "Projekty", icon: <FiGrid size={18} className="mr-2" /> },
        { id: 4, href: "/panel/userinfo", label: "Twoje informacje", icon: <FiUser size={18} className="mr-2" /> },
        // { id: 6, href: "/panel/manageusers", label: "Zarządzaj użytkownikami", icon: <FiUsers size={18} className="mr-2" /> },
        // { id: 7, href: "/panel/analitics", label: "Analityka", icon: <FiBarChart2 size={18} className="mr-2" /> },
    ];

    // Track screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative">
            {/* Menu button for mobile */}
            {isMobile && !isSidebarOpen && (
                <div className="absolute flex justify-center items-start p-2 md:hidden pt-4 pl-4">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                        <FiMenu size={32} />
                    </button>
                </div>
            )}

            {/* Sidebar */}
            {isSidebarOpen && (
                <aside className="fixed md:relative z-50 w-64 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col">
                    <div className="flex justify-start p-2 md:hidden">
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
                            <FiX size={36} />
                        </button>
                    </div>

                    <div className="p-6 border-b border-gray-200 flex justify-center">
                        <Link href="/">
                            <Image src="/oreka-logo.png" width={150} height={80} alt="logo" className="rounded-md" />
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <ul onClick={() => {
                            if(isMobile) setSidebarOpen(false)
                        }}>
                            {navItems.map(item => (
                                <Link key={item.id} href={item.href}>
                                    <li className={`w-full flex items-center px-4 py-2 cursor-pointer rounded-lg my-2 text-sm transition ${path === item.href ? 'bg-blue-400 hover:bg-blue-500 text-white' : 'bg-white hover:bg-gray-200 text-black'} font-normal`}>
                                        {item.icon} {item.label}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <Logout />
                    </div>
                </aside>
            )}
        </div>
    );
}
