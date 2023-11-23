"use client";
// import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  userId: string;
};

// let url = "https://arxiv.org/pdf/2310.07778.pdf";

const URLUpload = ({ userId }: Props) => {
  const [url, setUrl] = React.useState("");
  const [chat, setChat] = React.useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async ({
      videoId,
      userId,
    }: {
      videoId: string;
      userId: string;
    }) => {
      // const _transcript = await axios.post("/api/py/transcript", { videoId });

      console.log("Entering create mutation function");
      // console.log(_transcript);
      const response = await axios.post("/api/py/create", {
        videoId,
        userId,
      });
      console.log("Done embedding");
      console.log(response.data);
      // console.log(response.data[0]);
      console.log(response);
      return response.data;
    },
  });
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // fetch('/api', {url})
    const videoId = url.split("v=")[1].split("&")[0] as string;
    console.log(videoId);
    try {
      if (chat) {
        try {
          const _transcript = await axios.post(
            "http://127.0.0.1:8000/api/transcript",
            {
              videoId,
            }
          );
          // /api/py/transcript
          // const _transcript = await fetch(
          //   "http://127.0.0.1:8000/api/transcript",
          //   {
          //     method: "POST", // or 'PUT'
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({ videoId: videoId }),
          //   }
          //   );
          console.log(_transcript);
        } catch (error) {
          console.log(error);
        } finally {
          console.log("Done transcript");
          mutate(
            { videoId, userId },
            {
              onSuccess: (chatId) => {
                console.log(chatId);
                router.push(`/chat/${videoId}/${chatId}`);
              },
              onError: (err) => {
                console.log(err);
              },
            }
          );
        }
      } else {
        router.push(`/watch/${videoId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="flex flex-col max-w-xl px-8 mx-auto my-20 sm:px-0">
      <h1 className="self-center text-center sm:text-6xl">Explore</h1>
      <Info className="text-blue-400"></Info>
      <div className="">Enter the url for example:</div>
      <form
        className="mt-3 rounded-lg flex flex-col w-full"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="enter your pdf url"
          className="w-full rounded-md border border-input h-10 ring-offset-background px-3 mr-2 bg-slate-300/30"
          onChange={handleChange}
        />
        {/* <input type="submit"/> */}
        <div className="flex w-full justify-center mt-4 items-center">
          <Button
            type="submit"
            className="bg-slate-400 h-10 w-1/3 rounded-md mx-auto"
          >
            Transcript
          </Button>
          <Button
            type="submit"
            className="bg-slate-400 h-10 w-1/3 rounded-md mx-auto"
            onClick={() => setChat(true)}
          >
            Chat
          </Button>
        </div>
      </form>
      {/* <Button>Shadcn</Button> */}
    </div>
  );
};

export default URLUpload;
