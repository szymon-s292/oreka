import Image from "next/image";

export default function StarRating({ stars = 0 }: { stars?: number }) {

    return (
        <div className="select-none flex">
            {[...Array(stars)].map((_, index) => (
                <Image key={index} src="/star.svg" alt="star" width={24} height={24} />
            ))}

        </div>
    );
}
