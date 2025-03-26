import Image from "next/image";
import Header from "./ui/header";
import Footer from "./ui/footer"
import ContactForm from "./ui/contact-form";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Hello from "./ui/hello";
import ScrollFade from "./components/scroll-fade";
import StarRating from "./ui/rating";

export default function Home() {
  
  return (
    <>
    <Header/>
    <section className="h-screen" id="start">
      <ScrollFade fadeDuration={500} fadeThreshold={200}>
        <Hello/>
      </ScrollFade>
    </section>
    <section className="min-h-screen h-fit bg-neutral-300 flex items-center py-15" id="about">
      <div className="flex flex-col lg:flex-row gap-15 justify-between mx-[15%] w-full ">
          <div className="lg:max-w-1/2">
            <ScrollFade fadeDuration={500} fadeThreshold={500} reverse={true}>
              <p className="text-5xl font-bold mb-5 lg:mb-10">O mnie</p>
              <p className="tracking-wide lg:text-lg">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id nostrum voluptate fugit consequatur! Quibusdam consectetur blanditiis officia ratione deserunt. Deleniti molestiae velit animi ipsam esse voluptatem facilis explicabo sequi cumque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis necessitatibus consequuntur ipsum harum sint repellendus, iure aperiam eligendi? Culpa blanditiis iusto hic corporis provident veniam quo quis omnis quod esse? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam vero doloribus, qui illo repellendus ducimus praesentium magni quaerat accusantium, iure atque. Quia error expedita voluptatem iste aspernatur. Perferendis, dolores velit.</p>
            </ScrollFade>
          </div>
        <div >
          <Image className="rounded-full" src={"/person.svg"} alt="person" width={500} height={500}></Image>
        </div>
      </div>
    </section>
    <section className="h-screen" id="projects">
      {/*isloading*/}

    </section>
    <section className="h-fit lg:h-screen bg-neutral-300" id="opinions">
      <div className="flex lg:px-[15%] lg:gap-12 gap-5 flex-nowrap text-center h-full lg:justify-center overflow-x-auto items-center px-8">

      <ScrollFade fadeDuration={300} fadeThreshold={2500} reverse>
        <div className="bg-white p-4 h-fit lg:min-h-[500px] lg:min-w-[350px] lg:w-[350px] min-h-[400px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
          <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
          <p className="text-xl font-bold">Klient</p>
          <StarRating stars={5}/>
          <p className="lg:text-lg lg:tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi dolorem molestias dolores unde vel, itaque,
            porro at quasi ipsa sed mollitia commodi. Tempora praesentium nostrum quis? Assumenda, labore deserunt!
          </p>
        </div>
      </ScrollFade>
      <ScrollFade fadeDuration={300} fadeThreshold={2500} reverse>
        <div className="flex flex-col lg:mb-24 py-15 lg:pb-10">
          <div className="bg-white p-4 h-fit lg:min-h-[530px] lg:min-w-[350px] lg:w-[380px] min-h-[430px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
            <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
            <p className="text-xl font-bold">Klient</p>
            <StarRating stars={5}/>
            <p className="lg:text-lg lg:tracking-wide">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi dolorem molestias dolores unde vel, itaque,
              porro at quasi ipsa sed mollitia commodi. Tempora praesentium nostrum quis? Assumenda, labore deserunt!
            </p>
          </div>
        </div>
        </ScrollFade>
        <ScrollFade fadeDuration={300} fadeThreshold={2500} reverse>
        <div className="bg-white p-4 h-fit lg:min-h-[500px] lg:min-w-[350px] lg:w-[350px] min-h-[400px] min-w-[250px] w-[250px] rounded-xl shadow-lg flex justify-evenly flex-col lg:p-10 items-center">
          <Image src={"/person.svg"} height={100} width={100} alt="person" className="rounded-full" />
          <p className="text-xl font-bold">Klient</p>
          <StarRating stars={5}/>
          <p className="lg:text-lg lg:tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam modi dolorem molestias dolores unde vel, itaque,
            porro at quasi ipsa sed mollitia commodi. Tempora praesentium nostrum quis? Assumenda, labore deserunt!
          </p>
        </div>
        </ScrollFade>
      </div>
    </section>
    <section id="contact" className="lg:py-20">
      <ScrollFade fadeDuration={500} fadeThreshold={3300} reverse={true}>
        <ContactForm/>
      </ScrollFade>
    </section>
    <Footer/>
    <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} limit={3} />

    </>
  );
}
