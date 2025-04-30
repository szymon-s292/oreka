import Link from "next/link";
import Image from "next/image";
import FadeInOnScroll from "@/app/FadeInOnScroll";
import { FaHome } from 'react-icons/fa';
import { GiElectric } from 'react-icons/gi';
import { BsGraphUp } from 'react-icons/bs';

export default async function Services() {
 
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string

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
    <div className="mx-[15%]">
      <FadeInOnScroll delay={200}>
        <p className="text-5xl font-bold mb-5 lg:mb-10">Usługi</p>
      </FadeInOnScroll>

        <div className="flex flex-wrap lg:justify-center lg:mt-32 justify-start h-full items-center gap-8">
          {services.map((service, i) => {
            return (
              <FadeInOnScroll delay={400} key={i}>
                <div className="transition-transform duration-300 gap-10 py-16 text-sm hover:scale-105 bg-white h-[400px] w-[250px] lg:w-[350px] rounded-xl shadow-lg flex flex-col items-center lg:p-10">
                  <p>{service.ikona}</p>
                  <p className="text-xl font-bold text-center">{service.tytul}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {service.punkty.map((punkt, i) => (
                      <li key={i}>{punkt}</li>
                    ))}
                  </ul>
                </div>
              </FadeInOnScroll> 
            )
          })}
        </div>
    </div>
  );
}
