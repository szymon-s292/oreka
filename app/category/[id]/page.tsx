import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Link from "next/link";
import { ProjectCategory, Project} from "@/app/types/types"
import FadeInOnScroll from "@/app/FadeInOnScroll";
import Footer from "@/app/ui/footer"
import Header from "@/app/ui/header";

export default async function Category({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string
  
  const categoryData = await axios.get(`${NEXT_PUBLIC_BASE_URL}/api/categories`)
  const category: ProjectCategory | undefined = (await categoryData.data).find(
    (c: ProjectCategory) => c._id === id
  );
  
  const projectsData = await axios.get(`${NEXT_PUBLIC_BASE_URL}/api/projects/${id}`)
  const projects: Project[] | undefined = (await projectsData.data)

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Header/>
      <div className="lg:h-[50vh] h-[40vh] w-full relative">
        {category && (
          <Image
            src={BUCKET_URL + category.photoURL}
            fill
            className="object-cover"
            alt={`Category ${category._id}`}
            priority
          />
        )}
        <div className="absolute lg:top-0 top-10 inset-0 flex justify-center items-center">
          <FadeInOnScroll delay={200}>
            <div className="text-5xl lg:rounded-lg p-8 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              {category?.name}
            </div>
          </FadeInOnScroll>
        </div>
      </div>
      <div className="lg:mx-[15%] flex flex-col gap-8 my-8">
      {projects && projects.map((p) => {
        const imageUrl = p.images?.[0]?.name
          ? `${BUCKET_URL}${p.images[0].url}`
          : '/oreka-logo.png';

        return (
          <div
            key={p._id}
            className="bg-white lg:rounded-lg p-5 shadow-sm w-full flex lg:flex-row flex-col relative hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="h-64  w-full lg:w-1/3 relative rounded-md overflow-hidden">
              <Link href={`/project/${p._id}`}>
                <Image
                  src={imageUrl}
                  fill
                  alt="project image"
                  className="object-cover"
                />
              </Link>
            </div>

            <div className="px-4 flex flex-col lg:w-2/3 relative">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <p className="text-2xl font-semibold break-words truncate overflow-hidden whitespace-nowrap lg:my-0 mt-2">{p.name}</p>
                <div>
                  <ul className="text-md text-gray-500 mt-2">
                    {p.images && p.images.length > 1 && (
                      <li>+{p.images.length - 1} zdjęć</li>
                    )}
                    {p.files && p.files.length > 0 && (
                      <li>+{p.files.length} plik{p.files.length === 1 ? '' : p.files.length < 5 ? 'i' : 'ów'}</li>
                    )}
                  </ul>
                </div>
              </div>

              <p className="text-gray-600 max-w-1/2 break-words line-clamp-2 lg:line-clamp-6 mt-2">{p.description}</p>

              <div className="absolute bottom-4 right-4">
                <Link
                  href={`/project/${p._id}`}
                  className="bg-gray-400 hover:bg-blue-400 text-white text-lg px-8 py-2 rounded-lg "
                >
                  Zobacz
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      </div>
      <Footer/> 
    </main>
  );
}
