"use client";

import { useEffect, useRef, ReactNode } from "react";

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
}

export default function FadeInOnScroll({ children, delay = 0 }: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-show");
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-4 transition-all duration-700 h-fit overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
