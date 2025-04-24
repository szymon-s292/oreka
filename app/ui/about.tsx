import Image from "next/image";
import FadeInOnScroll from "@/app/FadeInOnScroll";

export default function About() {
  return (
    <div className="flex flex-col lg:flex-row gap-15 justify-between mx-[15%] w-full">
      <div className="lg:max-w-1/2">
        <FadeInOnScroll delay={200}>
          <p className="text-5xl font-bold mb-5 lg:mb-10">O mnie</p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={600}>
          <p className="tracking-wide lg:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis magni adipisci impedit praesentium deleniti reprehenderit nemo dignissimos assumenda sapiente consequuntur, cumque vitae obcaecati tempore labore ut alias enim, esse numquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae esse, beatae fugiat commodi ipsum quasi sapiente, provident eligendi, asperiores quo labore harum nobis omnis nihil culpa natus reiciendis ipsam. Non. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum consequatur, natus aliquid enim, debitis vel optio ipsam esse a porro quisquam! Numquam rerum incidunt animi minus dolorem quo itaque aperiam! elit...
          </p>
        </FadeInOnScroll>
      </div>
      <FadeInOnScroll delay={600}>
        <Image
          className="rounded-full"
          src={"/person.svg"}
          alt="person"
          width={500}
          height={500}
        />
      </FadeInOnScroll>
    </div>
  );
}
