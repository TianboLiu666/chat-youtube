import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  videoId: string;
};

const GalleryCard = async ({ videoId }: Props) => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API}&part=snippet&id=${videoId}`
  );
  const imageUrl =
    response.data.items[0].snippet.thumbnails?.high.url ||
    response.data.items[0].snippet.thumbnails?.default.url;
  //   console.log(response.data.items[0].snippet.thumbnails.high.url);
  const name = response.data.items[0].snippet.localized.title || response.data.items[0].snippet.title || '';
  return (
    <div className="border rounded-lg border-secondary drop-shadow-lg">
      <div className="relative">
        <Link href={`/watch/${videoId}`} className="relative block">
          <Image
            src={imageUrl}
            className="object-contain rounded-t-lg"
            width={500}
            height={500}
            alt="Image"
          ></Image>
          <span className="absolute px-2 py-1 text-white rounded-md bg-black/60 w-fit bottom-2 left-2 right-2">
            {name}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default GalleryCard;
