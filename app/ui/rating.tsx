import Image from "next/image";

export default function StarRating({stars}: {stars?: number}) {
    console.log(stars)
    return(
        <div className="select-none flex">
            <Image src={"/star.svg"} alt="" width={24} height={24}></Image>
            <Image src={"/star.svg"} alt="" width={24} height={24}></Image>
            <Image src={"/star.svg"} alt="" width={24} height={24}></Image>
            <Image src={"/star.svg"} alt="" width={24} height={24}></Image>
            <Image src={"/star.svg"} alt="" width={24} height={24}></Image>
        </div>
    )
}