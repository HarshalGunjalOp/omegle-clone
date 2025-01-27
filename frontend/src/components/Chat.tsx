import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Connect to the backend

interface Message {
  isSelf: boolean;
  sender: string;
  message: string;
}

const ChatBox = ({ roomId }: {roomId: string}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  // Join the room when the component mounts
  useEffect(() => {
    socket.emit("join-room", { roomId });

    // Listen for incoming messages
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect(); // Cleanup when component unmounts
    };
  }, [roomId]);

  // Send a message
  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const message = {
      sender: "You", // Replace with actual user ID/name if available
      message: inputMessage,
    };

    // Emit the message to the server
    socket.emit("send-message", { roomId, ...message });

    // Add the message to your own chat display
    setMessages((prev) => [...prev, { ...message, isSelf: true }]);
    setInputMessage(""); // Clear input
  };

  return (
    <div className="chat-box w-1/3 h-full bg-gray-100 p-4 flex flex-col">
      {/* Message List */}
      <div className="messages flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message my-2 p-2 rounded-lg ${
              msg.isSelf
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
            style={{ maxWidth: "80%" }}
          >
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="chat-input flex mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
