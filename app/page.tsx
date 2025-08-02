import Header from "./ui/header";
import ContactForm from "./ui/contact-form";

import Hello from "./ui/hello";
import About from "./ui/about";
import ProjectCategories from "./ui/project-categories";
import Opinions from "./ui/opinions";
import Footer from "./ui/footer"
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Services from "./ui/services";

export default async function Home() {
  const session = await auth()
  
  return (
    <>
    <SessionProvider session={session}>
      <Header/>
      <section className="h-screen" id="start">
        <Hello/>
      </section>
      <section className="min-h-screen h-fit py-16 lg:py-20 bg-[#f1f1f1]" id="about">
        <About/>
      </section>
    </SessionProvider>

    <section className="h-fit py-16 lg:py-20 bg-neutral-300" id="services">
      <Services/>
    </section>

    <section className="min-h-screen h-fit py-16 lg:py-20 bg-[#f1f1f1]" id="projects">
      <ProjectCategories/>
    </section>

    <SessionProvider session={session}>
      <section className="h-fit py-16 lg:py-20 bg-neutral-300" id="opinions">
        <Opinions/>
      </section>
      <section id="contact" className="py-16 lg:py-0 lg:h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:px-[15%]">
        <div className="w-full lg:w-1/2 h-64 sm:h-96 lg:h-[600px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.295488915591!2d17.982376777197548!3d51.48944347180916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xad3bf9fbdf79a4f7%3A0x44bff2519d5e526c!2sOreka%20Ewa%20Gruszczy%C5%84ska!5e0!3m2!1spl!2spl!4v1744842401572!5m2!1spl!2spl"
            className="w-full h-full lg:rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <ContactForm />
        </div>
      </section>
      <Footer/> 
    </SessionProvider>
    </>
  );
}
