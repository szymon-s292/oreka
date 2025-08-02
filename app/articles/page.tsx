import { Article } from "../types/types";
import Footer from "../ui/footer";
import Header from "../ui/header";
import axios from "axios";

export default async function Articles() {
 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const res = await fetch(`${baseUrl}/api/articles`);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data: Article[] = await res.json();

  return (
    <>
    <Header/>
    <main className="flex min-h-screen flex-col justify-between ">
      <div className="lg:mx-[15%] py-16 lg:py-20">
        <p className="text-5xl font-bold mt-16 mb-8">Artykuły</p>
        {data.map((a, i) => {
        return (
          <div key={i} className="mt-16 pb-8 border-b border-gray-400">
            <div className="flex justify-between">
              <p className="text-4xl mb-4 font-bold text-black">{a.title}</p>
              <div>
                <p>Autor: {a.author}</p>
              </div>
            </div>
            <p>{a.content}</p>
          </div>
          )
        })}
      </div>
      <Footer/>
    </main>
    </>
  )
}