"use client";
import Transcript from "@/components/Transcript";
import React from "react";

type Props = {
  params: {
    url: string;
  };
};

const page = ({ params: { url } }: Props) => {
  //   console.log(decodeURIComponent(url));
  const videoId = decodeURIComponent(url) as string;

  return (
    <div className="flex flex-row mt-16 w-full">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold">Video</h1>
        <iframe
          title="chapter video"
          className="w-full mt-4 mr-1 aspect-video max-h-[24rem]"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
        ></iframe>
      </div>
      <div className="w-1/2 ml-1 sticky inset-x-0 top-0">
        <Transcript videoId={videoId} />
      </div>
    </div>
  );
};

export default page;
