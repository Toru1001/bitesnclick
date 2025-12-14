"use client";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";

type Message = {
  sender: "user" | "assistant";
  text: string;
};

const Chatbot: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("chat_messages");

    if (stored && stored !== "[]") {
      // If there are messages in sessionStorage, use them
      setMessages(JSON.parse(stored));
    } else {
      // Initialize with default assistant message if empty
      console.log(
        "No stored messages found, initializing with default message."
      );
      setMessages([
        { sender: "assistant", text: "How may I assist you today?" },
      ]);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };

    setMessages((prev) => [
      ...prev,
      userMessage,
      { sender: "assistant", text: "..." },
    ]);
    setInput("");

    try {
      const updatedMessages = [...messages, userMessage];
      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      const botText = data.reply ?? "No response from AI.";

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, text: botText } : msg
        )
      );
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, text: "Error: Could not get response from AI." }
            : msg
        )
      );
    }
  };

  if (pathname.startsWith("/cart") || pathname.startsWith("/admin")) return null;
  const TypingIndicator = () => (
    <div className="flex gap-1 py-1">
      <span
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></span>
      <span
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 w-100 bg-white rounded-lg shadow-lg z-50 flex flex-col">
      <div
        className={`flex flex-row justify-between items-center px-4 py-2 cursor-pointer ${
          isOpen ? "border-b border-gray-300" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Chat Support</span>
        <span className="text-lg">{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div className="flex flex-col h-100">
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm break-words w-max whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "ml-auto bg-[#E19517] text-white"
                    : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text === "..." ? (
                  <TypingIndicator />
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      br: ({ ...props }) => <br {...props} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-2 border-t">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message here"
              className="resize-none"
            />
            <Button
              onClick={sendMessage}
              className="bg-[#E19517] hover:bg-[#E19517]/70 cursor-pointer"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
