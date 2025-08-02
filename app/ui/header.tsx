'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMenu, HiX } from 'react-icons/hi';

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

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header
          className={`lg:px-[15%] fixed  shadow-lg w-screen z-10 ${scrolling ? 'h-16' : 'h-25'} transition-all duration-500 ease-in-out`} 
          style={{ backgroundColor: `rgba(255, 255, 255, ${menuOpen ? '1' : '0.7'})` }}
        >
          <div className="px-4 flex justify-between items-center h-full">
            {/* Logo */}
            <div id="logo">
              <Link href="/">
                <div className="hidden lg:block">
                  <Image
                    src="/oreka-logo-transparent.png"
                    alt="oreka logo"
                    className="transition-all duration-500 ease-in-out"
                    width={scrolling ? 64 : 100}
                    height={scrolling ? 64 : 100}
                  />
                </div>
                <div className="lg:hidden flex items-center h-full">
                  <Image
                    src="/oreka-logo-transparent.png"
                    alt="oreka logo"
                    width={64}
                    height={64}
                  />
                </div>
              </Link>
            </div>
    
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 lg:gap-10">
              <NavLinks activeSection={activeSection} />
            </nav>
    
            {/* Hamburger Button (Mobile) */}
            <button className="lg:hidden focus:outline-none" onClick={toggleMenu}>
                {menuOpen ? (
                    <HiX className="w-8 h-8 text-gray-800" />
                ) : (
                    <HiMenu className="w-8 h-8 text-gray-800" />
                )}
            </button>
          </div>
    
          {/* Mobile Nav Links */}
          {menuOpen && (
            <div className="lg:hidden items-center flex flex-col gap-4 text-lg py-4 bg-white shadow-md transition-all">
              <NavLinks activeSection={activeSection} onClick={() => setMenuOpen(false)} />
            </div>
          )}
        </header>
      );
    }
    
function NavLinks({ activeSection, onClick }: { activeSection: string; onClick?: () => void }) {
  const linkClass = (section: string) =>
    `nav-link font-semibold ${activeSection === section ? 'text-blue-500' : ''}`;

  return (
    <>
      <Link href="/articles" className={linkClass('articles')} onClick={onClick}>Artykuły</Link>
      <Link href="/#about" className={linkClass('about')} onClick={onClick}>O mnie</Link>
      <Link href="/#services" className={linkClass('services')} onClick={onClick}>Usługi</Link>
      <Link href="/#projects" className={linkClass('projects')} onClick={onClick}>Katalog</Link>
      <Link href="/#opinions" className={linkClass('opinions')} onClick={onClick}>Opinie</Link>
      <Link href="/#contact" className={linkClass('contact')} onClick={onClick}>Kontakt</Link>
    </>
  );
}