import Link from "next/link";
import Image from "next/image";
import FadeInOnScroll from "@/app/FadeInOnScroll";
import { FaHome } from 'react-icons/fa';
import { GiElectric } from 'react-icons/gi';
import { BsGraphUp } from 'react-icons/bs';
import CardContainer from "./card-container";
import Card from "./card";

export default async function Services() {
  const services = [
    {
      tytul: 'Projekty budynków',
      ikona: <FaHome size={48} />,
      punkty: [
        'Projekty gotowe budynków',
        'Projekty indywidualne',
        'Adaptacje projektów gotowych',
      ],
    },
    {
      tytul: 'Audyt energetyczny',
      ikona: <GiElectric size={48} />,
      punkty: [
        'Audyt energetyczny',
        'Audyt energetyczny „Czyste Powietrze”',
      ],
    },
    {
      tytul: 'Charakterystyki energetyczne',
      ikona: <BsGraphUp size={48} />,
      punkty: [
        'Świadectwa charakterystyki energetycznej',
        'Projektowane charakterystyki energetyczne',
      ],
    },
  ];

  return (
    <>
    <div className="mx-[15%]">
      <FadeInOnScroll delay={200}>
        <p className="text-5xl font-bold mb-5 lg:mb-10">Usługi</p>
      </FadeInOnScroll>
    </div>

    <FadeInOnScroll delay={600}>
      <CardContainer css="md:mx-[15%] pb-8">
        {services.map((s, i) => {
          return (
            <Card key={i} css={`min-w-[320px] w-[320px] min-h-[300px] flex items-center gap-8 pt-8`}>
              <i>{s.ikona}</i>
              <p className="text-2xl font-bold text-center text-black">{s.tytul}</p>
              <div className="flex flex-col justify-center">
                <ul className="space-y-2">
                  {s.punkty.map((p, j) => {
                    return <li className="text-center" key={j}>{p}</li>
                  })}
                </ul>
              </div>
            </Card>
          )
        })}
      </CardContainer>
    </FadeInOnScroll>
    </>
  );
}
