'use client'
import Link from "next/link";

export default function Hello() {
  return (
    <div
      className={`flex justify-center items-center flex-col h-screen gap-20 select-none transition-opacity duration-500 ease-out opacity-100`}
    >
      <div>
        <h1 className="mx-5 font-bold lg:text-6xl bg-[#f1f1f11f] backdrop-blur-xs p-8 rounded-3xl text-4xl">
          <span>Zrealizuj</span> <span>swoje</span> <br className="lg:hidden"/>
          <span>marzenie</span> <span>o</span> <span>domu</span> <br />
          <span>Wybierz</span> <span>najlepszy</span><br className="lg:hidden"/>
          <span>projekt</span> <span>dla</span> <span>siebie</span>
        </h1>
      </div>
      <div className="flex gap-5 lg:gap-20">
        <p>
          <Link href="#projects" className="text-white text-lg bg-blue-400 rounded-full px-6 py-2 hover:border-blue-500 border-blue-400 border-2 shadow-lg hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
            Przeglądaj projekty
          </Link>
        </p>
        <p>
          <Link href="#contact" className="text-lg rounded-full px-8 py-2 border-blue-400 border-2 shadow-lg hover:bg-blue-400 hover:text-white hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
            Kontakt
          </Link>
        </p>
      </div>
    </div>
  );
}
