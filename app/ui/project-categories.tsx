import { ProjectCategory } from "../types/types";
import Link from "next/link";
import Image from "next/image";
import FadeInOnScroll from "@/app/FadeInOnScroll";

export default async function ProjectCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const res = await fetch(`${baseUrl}/api/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories: ProjectCategory[] = await res.json();
  const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string

  return (
    <div className="mx-[15%]">
      <FadeInOnScroll delay={200}>
        <p className="text-5xl font-bold mb-5 lg:mb-10">Katalog projektów</p>
      </FadeInOnScroll>

      <FadeInOnScroll delay={600}>
        <div className="flex flex-wrap rounded-lg justify-center lg:justify-start gap-8">
          {categories.map((post) => (
            <div key={post._id} className="shadow-lg rounded-lg bg-neutral-300 hover:text-white hover:bg-blue-400 duration-200">
              <Link href={`/category/${post._id}`}>
                <div className="h-[220px] w-[300px] rounded-t-lg">
                  <Image
                    src={BUCKET_URL + post.photoURL || "/oreka-logo.png"}
                    width={300}
                    height={220}
                    alt="category-image"
                    className="rounded-t-lg object-cover w-full h-full"
                  />
                </div>
                <div className="text-center py-2">{post.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </div>
  );
}
