"use client"; // Make sure this is at the top if you're using App Router

import { useEffect, useRef } from "react";
import Image from "next/image";
import StarRating from "./rating";
import FadeInOnScroll from "@/app/FadeInOnScroll";

export default function Opinions() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && window.innerWidth <= 768) {
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }
  }, []);

  return (
    <div>
      <FadeInOnScroll delay={200}>
        <div className="mx-[15%] py-16">
          <p className="text-5xl font-bold mb-5 lg:mb-10 ">Opinie klientów</p>
        </div>
      </FadeInOnScroll>
    <div
      ref={scrollContainerRef}
      id="scroll-container"
      className="flex lg:px-[15%] overflow-hidden lg:gap-12 gap-5 flex-nowrap text-center h-fit lg:justify-center overflow-x-auto items-center px-8 scroll-smooth"
    >
      <FadeInOnScroll delay={600}>
      <div className="transition-transform duration-300 hover:scale-105 bg-white p-4 h-fit lg:min-h-[500px] lg:min-w-[350px] lg:w-[350px] min-h-[400px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
        <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
        <p className="text-xl font-bold">Klient</p>
        <StarRating stars={4} />
        <p className="lg:text-lg lg:tracking-wide">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi dolorem molestias dolores unde vel, itaque,
          porro at quasi ipsa sed mollitia commodi. Tempora praesentium nostrum quis? Assumenda, labore deserunt!
        </p>
      </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={200}>
        <div className=" transition-transform duration-300 hover:scale-105 flex flex-col lg:mb-24 py-15 lg:pb-10">
          <div className="bg-white p-4 h-fit lg:min-h-[530px] lg:min-w-[350px] lg:w-[380px] min-h-[430px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
            <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
            <p className="text-xl font-bold">Klient</p>
            <StarRating stars={5} />
            <p className="lg:text-lg lg:tracking-wide">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi dolorem molestias dolores unde vel, itaque,
              porro at quasi ipsa sed mollitia commodi. Tempora praesentium nostrum quis? Assumenda, labore deserunt!
            </p>
          </div>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll delay={400}>
        <div className="transition-transform duration-300 hover:scale-105 bg-white p-4 h-fit lg:min-h-[500px] lg:min-w-[350px] lg:w-[350px] min-h-[400px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
          <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
          <p className="text-xl font-bold">Klient</p>
          <StarRating stars={3} />
          <p className="lg:text-lg lg:tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi dolorem molestias dolores unde vel, itaque,
            porro at quasi ipsa sed mollitia commodi. Tempora praesentium nostrum quis? Assumenda, labore deserunt!
          </p>
        </div>
      </FadeInOnScroll>
    </div>
    </div>

  );
}
