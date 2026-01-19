import { Router } from "express";
import prisma from "../db";
import { auth } from "../middleware/auth";

const router = Router();

/**
 * GET all operators (for chat list)
 */
router.get("/operators", auth, async (req, res) => {
  const currentUserId = req.user!.id;

  const operators = await prisma.user.findMany({
    where: {
      role: "OPERATOR",
      id: { not: currentUserId },
    },
    select: {
      id: true,
      email: true,
      Employee: {
        select: {
          name: true,
          roleTitle: true,
        },
      },
    },
  });

  res.json(operators);
});




/**
 * GET messages between logged-in operator & another operator
 */
router.get("/:receiverId", auth, async (req, res) => {
  const senderId = req.user!.id;
  const receiverId = req.params.receiverId;

  if (!receiverId) {
    return res.status(400).json({ error: "receiverId required" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


/**
 * SEND message
 */
router.post("/", auth, async (req, res) => {
  const senderId = req.user!.id;
  const { receiverId, text } = req.body;

  console.log("SENDER ID:", senderId);
  console.log("RECEIVER ID:", receiverId);
  console.log("TEXT:", text);

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
    });

    res.json(message);
  } catch (err) {
    console.error("Message create error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});


export default router;
