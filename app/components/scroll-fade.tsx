'use client'
import { useState, useEffect } from "react";

export default function ScrollFade({
  children,
  fadeThreshold = 100,
  fadeDuration = 500,
  reverse = false
}: Readonly<{
  children: React.ReactNode;
  fadeThreshold: number
  fadeDuration: number
  reverse?: boolean
}>) {
  const [isFaded, setIsFaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > fadeThreshold) {
        setIsFaded(true);  // Fade out
      } else {
        setIsFaded(false); // Fade in
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fadeThreshold]);

  return (
    <div
      className={`transition-opacity duration-${fadeDuration} ease-in-out ${
        reverse ? (isFaded ? "opacity-100" : "opacity-0") : (isFaded ? "opacity-0" : "opacity-100" )
      }`}
    >
      {children}
    </div>
  );
};
