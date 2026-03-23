import { useEffect, useState } from "react";
import { socket } from "../../services/socket";

export const ChatPanel = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!chatId) return;

    socket.connect();
    socket.emit("chat:join", chatId);

    const handleMessage = (message) => setMessages((current) => [...current, message]);
    socket.on("chat:message", handleMessage);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.disconnect();
    };
  }, [chatId]);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Live Chat</h2>
      <div className="mb-4 h-56 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div key={index} className="rounded-2xl bg-white p-2 text-sm">
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input className="flex-1 rounded-2xl border p-3" value={text} onChange={(e) => setText(e.target.value)} />
        <button
          type="button"
          onClick={() => {
            socket.emit("chat:message", { chatId, sender: "me", text });
            setText("");
          }}
          className="rounded-full bg-emerald-600 px-4 py-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};
