import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8080",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join", (userId: string) => {
      socket.join(userId); // private room per user
    });

    socket.on("send-message", (data) => {
      const { receiverId } = data;
      io.to(receiverId).emit("receive-message", data);
    });

    socket.on("typing", ({ receiverId }) => {
      io.to(receiverId).emit("typing");
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
}
