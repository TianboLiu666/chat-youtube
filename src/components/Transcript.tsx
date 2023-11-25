"use client";

import React, { useEffect, useState } from "react";

type Props = {
  videoId: string;
};


const Transcript = ({ videoId }: Props) => {
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_FLASK_URL);
    const sse = new EventSource(
      `${process.env.NEXT_PUBLIC_FLASK_URL}/api/whisper2?url=${videoId}`
    );
    function handleStream(e: any) {
      // console.log(e);
      setData((prevData) => {
        return [...prevData, e.data];
      });
    }
    sse.onmessage = (e) => {
      handleStream(e);
    };
    sse.onerror = (e) => {
      sse.close();
    };
    return () => {
      sse.close();
    };
    
  }, []);


  useEffect(() => {
    const transcriptContainer = document.getElementById("message-container");
    if (transcriptContainer) {
      transcriptContainer.scrollTo({
        top: transcriptContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [data]);
  return (
    <div id="message-container">
      <h1>Transcript:</h1>
      {data.map((res, idx) => {
        return <p key={idx}>{res}</p>;
      })}
    </div>
  );
};
export default Transcript;
