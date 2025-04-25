'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [activeSection, setActiveSection] = useState('');
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            let currentSection = '';
    
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 0 && rect.bottom >= 0) {
                    currentSection = section.id;
                }
            });
    
            setActiveSection(currentSection);
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    return (
        <header className={`lg:px-[15%] px-0 fixed bg-white shadow-lg w-screen z-10 ${scrolling ? "h-16" : "h-25"} transition-all duration-500 ease-in-out`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
            <div className="flex justify-between opacity-100 h-full">
                <div id="logo">
                    <Link href={'/'}>
                        <Image
                            src="/oreka-logo-transparent.png"
                            alt="oreka logo"
                            className="transition-all duration-500 ease-in-out hidden lg:block"
                            width={scrolling ? 64 : 100}
                            height={scrolling ? 64 : 100}
                        />
                        <div className="flex items-center lg:hidden h-full">
                        <Image
                            src="/oreka-logo-transparent.png"
                            alt="oreka logo"
                            className="transition-all duration-500 ease-in-out "
                            width={64}
                            height={64}
                        />
                        </div>
                    </Link>
                </div>
                <nav className="flex items-center gap-5 lg:gap-10 px-2 lg:px-0">
                    <Link href={'/#about'} className={`nav-link font-semibold ${activeSection === 'about' ? 'text-blue-500' : ''}`}>O mnie</Link>
                    <Link href={'/#projects'} className={`nav-link font-semibold ${activeSection === 'projects' ? 'text-blue-500' : ''}`}>Katalog</Link>
                    <Link href={'/#opinions'} className={`nav-link font-semibold ${activeSection === 'opinions' ? 'text-blue-500' : ''}`}>Opinie</Link>
                    <Link href={'/#contact'} className={`nav-link font-semibold ${activeSection === 'contact' ? 'text-blue-500' : ''}`}>Kontakt</Link>
                </nav>
            </div>
        </header>
    );
}
