"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import StarRating from "./rating";
import FadeInOnScroll from "@/app/FadeInOnScroll";
import CardContainer from "./card-container";
import Card from "./card";

interface Opinion {
  issuer: string,
  content: string
  stars: number
  primary?: boolean
}

export default function Opinions() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const container = scrollContainerRef.current;
  //   if (container && window.innerWidth <= 768) {
  //     container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  //   }
  // }, []);

  const opinions: Opinion[] = [
    {
      issuer: "Paulina Sztandera",
      content: "Jestem bardzo zadowolona ze współpracy z Panią Ewą. Nie tylko przygotowała projekt domu ale również pomogła w dużo szerszym zakresie. Bardzo dobry kontakt i pozytywne nastawienie to kolejne atuty Pani Ewy Serdecznie polecam współpracę.", 
      stars: 5
    },
    {
      issuer: "Magdalena Konieczna",
      content: "Polecam współpracę z panią Ewą, stały kontakt telefoniczny, mailowy i na Whatsappie. Oprócz projektów pomagała mi także z dokumentacją na różnych etapach (warunki zabudowy, pozwolenie na budowę).",
      stars: 5
    }
  ]

  return (
    <div className="h-full">
      <FadeInOnScroll delay={200}>
        <div className="mx-[15%]">
          <p className="text-5xl font-bold mb-5 lg:mb-10">Opinie klientów</p>
        </div>
      </FadeInOnScroll>
      <div ref={scrollContainerRef}>
        <FadeInOnScroll delay={600}>
          <CardContainer css="lg:mx-[15%] lg:px-0 px-16 mb-10 lg:justify-center">
            {opinions.map((o, i) => {
              return (
                <Card key={i} css={`min-w-[320px] w-[320px] min-h-[300px] flex items-center gap-4 py-8`}>
                  <Image src={'/person.svg'} alt="Opinia" width={64} height={64}></Image>
                  <StarRating stars={o.stars}/>
                  <p className="text-2xl font-bold text-center text-black">{o.issuer}</p>
                  <p className="text-center">{o.content}</p>
                </Card>
              )
            })}
          </CardContainer>
        </FadeInOnScroll>        
      </div>
    </div>
  );
}


{/* <FadeInOnScroll delay={600}>
<div className="transition-transform duration-300 hover:scale-105 bg-white p-4 h-fit lg:min-h-[500px] lg:min-w-[350px] lg:w-[350px] min-h-[400px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
  <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
  <p className="text-xl font-bold">Paulina Sztandera</p>
  <StarRating stars={5} />
  <p className="lg:text-lg lg:tracking-wide">
  </p>
</div>
</FadeInOnScroll> */}
{/*   <FadeInOnScroll delay={200}>
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
</FadeInOnScroll>*/}