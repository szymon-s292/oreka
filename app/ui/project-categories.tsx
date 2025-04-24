import { ProjectCategory } from "../types/types"
import axios from 'axios'
import Link from "next/link";
import Image from "next/image";
import FadeInOnScroll from "@/app/FadeInOnScroll";

export default async function ProjectCategories(){
    const BASE_URL = process.env.BASE_URL as string;
    const data = await axios.get(`${BASE_URL}/api/categories`)
    const categories = await data.data

    return (
        <div className="mx-[15%]">
            <FadeInOnScroll delay={200}>
                <p className="text-5xl font-bold mb-5 lg:mb-10 ">Katalog projektów</p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={600}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                {categories.map((post: ProjectCategory) => (
                    <div key={post._id} className="shadow-lg rounded-lg bg-neutral-300 hover:text-white hover:bg-blue-400 duration-200">
                        <Link href={`${BASE_URL}/category/${post._id}`}>
                            {(post.photoURL == '' || !post.photoURL) ? (
                                <div className="h-[220px] w-[300px]">
                                    <Image src={"/oreka-logo.png"} width={300} height={220} alt="category-image" className="rounded-t-lg object-cover w-full h-full"/>
                                </div>
                            ) : (
                                <div className="h-[220px] w-[300px]">
                                    <Image src={post.photoURL} width={300} height={220} alt="category-image" className="object-cover rounded-t-lg w-full h-full"/>
                                </div>
                            )}
                            <div className="text-center py-2">
                                {post.name}
                            </div>
                        </Link>
                    </div>
                ))}
                </div>
            </FadeInOnScroll>
        </div>
    )
}