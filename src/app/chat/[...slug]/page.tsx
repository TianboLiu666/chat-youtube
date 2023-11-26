import ChatComponent from "@/components/ChatComponent";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    slug: string[];
  };
};

const page = async ({ params: { slug } }: Props) => {
  const [_videoId, _chatId] = slug
  const chatId = parseInt(_chatId)
  const videoId = decodeURIComponent(_videoId) as string;
  console.log("chat " + videoId);
  const session = await getAuthSession();
  const userId = session?.user.id;
  console.log("chat " + userId);
  if (!userId) {
    return redirect("/");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  // console.log(_chats);
  if (!_chats) {
    return redirect("/");
  }
  const chat = _chats[_chats.length-1]
  // const chat = _chats.find((chat) => chat.videoId === videoId);
  // console.log(chat)

  if (!chat) {
    return redirect("/");
  }
  // const chatId = chat.id;
  console.log(chatId)

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
        <ChatComponent chatId={chatId} />
      </div>
    </div>
  );
};

export default page;
