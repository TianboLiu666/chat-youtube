"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const { data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-2 bg-black/5 h-fit rounded-md">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      <MessageList messages={messages} />
      <form
        action=""
        onSubmit={handleSubmit}
        className="sticky botton-0 inset-x-0 px-2 py-4 bg-black/10"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-500 ml-2">
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
