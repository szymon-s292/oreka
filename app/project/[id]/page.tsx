import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Link from "next/link";
import { Project} from "@/app/types/types"
import Footer from "@/app/ui/footer"
import Header from "@/app/ui/header";
import { FiDownload } from "react-icons/fi";
import ContactForm from "@/app/ui/contact-form";
import ImageSlider from "@/app/ui/image-slider";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const response = await axios.get(`${NEXT_PUBLIC_BASE_URL}/api/project/${id}`);
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string
  const project: Project = response.data;
  
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="lg:mx-[15%] my-32 p-5 rounded-lg bg-white">
        {project && <div className="flex flex-col gap-8">
          <div className="text-3xl overflow-ellipsis">{project.name}</div>
          {(project.images && project.images.length > 1) && <div className="w-full h-[320px] lg:h-[600px] relative">
            <ImageSlider
              images={project.images}
              baseUrl={BUCKET_URL}
              altText={project.name}
            />
            </div>}
          {(project.images && project.images.length === 1) && <div className="w-full h-[320px] lg:h-[500px] relative">
            <Image src={BUCKET_URL + project.images[0].url} alt="image" fill className="rounded-lg object-cover"/>
            </div>}

          <section className="flex gap-8 flex-col lg:flex-row">
            <div className="w-full lg:w-2/3 bg-neutral-100 h-full p-4 rounded-lg">
              <p className="text-lg mb-4 ">Opis:</p>
              <p className="break-words">
                {project.description}
              </p>
            </div>
            {project.files && project.files.length > 0 && <div className="w-full lg:w-1/3 p-4 rounded-lg bg-neutral-100 h-full">
              <p className="text-lg mb-4">Pliki do pobrania:</p>
              <ul>
                {project.files.map((file) => {
                  return (
                    <li key={file.url} className="text-sm hover:underline my-3 flex">
                      <FiDownload size={20}/><Link href={BUCKET_URL + file.url} download target="_blank" rel="noopener noreferrer">{file.name}</Link>
                    </li>
                  )
                })}
              </ul>
            </div>}
          </section>

          <section className="flex flex-col lg:flex-row items-end">
            <div className="w-full lg:w-3/5">
              <ContactForm/>
            </div>
            <div className="w-full lg:w-1/3 flex justify-center relative overflow-hidden h-54">
              <Image src={'/oreka-logo-transparent.png'} fill alt="oreka-logo" className="object-cover"></Image>
            </div>
          </section>
        </div>}
      </div>
      <Footer />
    </main>
  );
}