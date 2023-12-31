import { db } from "@/lib/db";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import axios from "axios";
import OpenAI from "openai";
import { messages as _messages, chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("entering chat");
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    const videoId = _chats[0].videoId;
    const lastMessage = messages[messages.length - 1];
    console.log("Im here");
    console.log(process.env.NEXT_PUBLIC_FLASK_URL);
    console.log(process.env.BACKEND);
    const _data = await axios.post(
      // "http://0.0.0.0:8000//api/getContext",
      // "http://python-flask:8000/api/getContext",
      `${process.env.BACKEND}/api/getContext`,
      {
        query: lastMessage.content,
        videoId: videoId,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    const context = _data.data.substring(0, 3000);
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      The CONTEXT BLOCK is from part of transcription of a youtube video, where the timestamp is indicated as TIMESTAMP=.
      For example TIMESTAMP=60.32 means the video is currently at 60.32 seccond.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });
    const stream = OpenAIStream(response, {
      onStart: async () => {
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });
      },
      onCompletion: async (completion) => {
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: "system",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
  }
}
