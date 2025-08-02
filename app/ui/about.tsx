import Image from "next/image";
import FadeInOnScroll from "@/app/FadeInOnScroll";

export default function About() {
  const content = "Lorem ipsum dolor sit am dolor sit amet consectetur adipisicingLorem ipsum dolor sit amet ipsum dolor sit amet consectetur adipisicingLorem ipsum dolor sit amet, consectetur adipisicing Lorem ipsum dolor sit amet consectetur adipisicingLorem ipsum dolor sit amet, consectetur adipisicing Lorem ipsum dolor sit amet consectetur adipisicingectetur adipisicing elit. Blanditiis magni adipisci impedit praesentium deleniti reprehenderit nemo dignissimos assumenda sapiente consequuntur, cumque vitae obcaecati tempore labore ut alias enim, esse numquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae esse, beatae fugiat commodi ipsum quasi sapiente, provident eligendi, asperiores quo labore harum nobis omnis nihil culpa natus reiciendis ipsam. Non. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum consequatur, natus aliquid enim, debitis vel optio ipsam esse a porro quisquam! Numquam rerum incidunt animi minus dolorem quo itaque aperiam! elit..."
  return (
    <>
    <div className="mx-[15%] h-full">
      <FadeInOnScroll delay={200}>
        <p className="text-5xl font-bold mb-5 lg:mb-10">O mnie</p>
      </FadeInOnScroll>
    </div>
    <FadeInOnScroll delay={600}>
      <div className="mx-[15%] flex items-center">
        <div className="flex lg:flex-row flex-col items-center">
            <div className="lg:w-1/2"><p className="tracking-wide lg:text-lg">{content}</p></div>
            <div className="lg:w-1/2 flex justify-center mt-8">
              <Image className="rounded-full" src={"/person.svg"} alt="person" width={400} height={400}/>
            </div>
        </div>
      </div>
    </FadeInOnScroll>
    </>
  );
}
