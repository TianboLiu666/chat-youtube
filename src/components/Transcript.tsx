"use client";
// import axios from "axios";
// import { useCompletion } from "ai/react";
import React, { useEffect, useState } from "react";

type Props = {
  videoId: string;
};

// async function transcript(videoId: string) {
//   let result = "";
//   //   const decoder = new TextDecoder();
//   console.log(`/api/py/transcript/${videoId}`);
//   console.log(JSON.stringify({ url: videoId }));
//   const response = await fetch(
//     `http:localhost:3000/api/py/whisper2?url=${videoId}`
//   );
//   console.log(typeof response.body);
//   //   const response = await axios.get("/api/py/transcript", {
//   //     params: { url: videoId },
//   //   });
//   return response.text();
//   //   console.log(typeof data);
//   //   return response;
//   //   console.log('data')
// }

const Transcript = ({ videoId }: Props) => {
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    const sse = new EventSource(`/api/py/whisper2?url=${videoId}`);
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
    // let socket = new WebSocket(`ws://localhost:3000/api/py/whisper2?url=${videoId}`)
    // socket.onopen = function() {
    //     console.log("Socket opened");
    //   };
    //   socket.onmessage = function(event) {
    //     console.log("Message received: " + event.data);
    //     document.getElementById("paragraph")!.innerHTML += event.data;
    //   };
    //     const fetchData = () => {
    //       const response = fetch(
    //         `http:localhost:3000/api/py/whisper2?url=${videoId}`
    //       )
    //         .then((response) => response.text())
    //         .then((res) => setData(res));

    //       fetchData();
    //     };
  }, []);
  // const { completion } = useCompletion({
  //   api: `http:localhost:3000/api/py/whisper2?url=${videoId}`,
  // });
  //   const res = transcript(videoId);

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

  //   return (
  //     <div>
  //       {data.map((item, id) => (
  //         <div key={id}>{item}</div>
  //       ))}
  //     </div>
  //   );
};
export default Transcript;
