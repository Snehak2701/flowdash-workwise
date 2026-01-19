import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/pages/AuthContext";
import axios from "axios";
import { socket } from "@/lib/socket";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Operator {
  id: string;
  email: string;
  Employee?: {
    name: string;
    roleTitle: string;
  };
}


interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export default function OperatorMessages() {
  const { user } = useAuth();

  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedUser, setSelectedUser] = useState<Operator | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [unread, setUnread] = useState<Record<string, number>>({});
  const handleTyping = () => {
  socket.emit("typing", selectedUser.id);
};
<Input
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);
    handleTyping();
  }}
/>


  /* ✅ AUTH GUARD (ONLY ONCE) */
  if (!user || !user.id) {
    return (
      <Layout>
        <p className="text-center text-gray-500 mt-10">
          Please login to use messages
        </p>
      </Layout>
    );
  }

  const currentUserId = user.id;

  /* 🔹 Fetch operators */
  useEffect(() => {
    axios
      .get<Operator[]>(`${API_BASE_URL}/messages/operators`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setOperators(res.data))
      .catch((err) => console.error("Failed to load operators", err));
  }, []);

  /* 🔹 Socket connection */
  useEffect(() => {
    socket.connect();
    socket.emit("join", currentUserId);

    socket.on("receive-message", (msg) => {
  setMessages((prev) => [...prev, msg]);

  // if chat not open, mark unread
  if (selectedUser?.id !== msg.senderId) {
    setUnread((prev) => ({
      ...prev,
      [msg.senderId]: (prev[msg.senderId] || 0) + 1,
    }));
  }
});

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  /* 🔹 Fetch messages when user selected */
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get<Message[]>(`${API_BASE_URL}/messages/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMessages(res.data));
  }, [selectedUser]);

  /* 🔹 Send message */
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const res = await axios.post<Message>(
      `${API_BASE_URL}/messages`,
      {
        receiverId: selectedUser.id,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setMessages((prev) => [...prev, res.data]);

    socket.emit("send-message", res.data);
    setMessage("");
  };

  /* ✅ SINGLE JSX RETURN */
  return (
    <Layout>
      <div className="grid grid-cols-12 gap-6 h-[70vh]">
        {/* LEFT – OPERATORS */}
        <Card className="col-span-4 p-4">
          <h2 className="font-semibold mb-3">Operators</h2>
          <div className="space-y-2">
            {operators.map((op) => (
              <div
                key={op.id}
                onClick={() => {
  setSelectedUser(op);
  setUnread((prev) => ({ ...prev, [op.id]: 0 }));
}}

                className={`p-2 rounded cursor-pointer ${
                  selectedUser?.id === op.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
  <div>
  <p className="font-medium">
    {op.Employee?.name ?? op.email}
  </p>
  <p className="text-xs text-gray-500">
    {op.Employee?.roleTitle ?? "Operator"}
  </p>
</div>

  {unread[op.id] > 0 && (
    <span className="ml-2 bg-red-500 text-white text-xs px-2 rounded-full">
      {unread[op.id]}
    </span>
  )}
</div>

              </div>
            ))}
          </div>
        </Card>

        {/* RIGHT – CHAT */}
        <Card className="col-span-8 p-4 flex flex-col">
          {!selectedUser ? (
            <p className="text-gray-500 m-auto">
              Select an operator to start chatting
            </p>
          ) : (
            <>
              <h2 className="font-semibold mb-2">
                Chat with {selectedUser.email}
              </h2>

              <div className="flex-1 border rounded p-3 overflow-y-auto space-y-2">
                {messages.map((msg) => {
                  const isYou = msg.senderId === currentUserId;

                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[70%] p-2 rounded text-sm ${
                        isYou
                          ? "bg-[#0000cc] text-white ml-auto"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1">
                        {isYou ? "You" : selectedUser.email}
                      </div>
                      {msg.text}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button onClick={sendMessage} disabled={!message.trim()}>
                  Send
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
