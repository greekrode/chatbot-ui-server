import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

const pChat = prisma.chat;
const pMessage = prisma.message;
router.get("/", async (req: any, res: any) => {
  try {
    const chats = await pChat.findMany({ where: { userId: req.user.id } });

    const result = await Promise.all(
      chats.map(async (chat) => {
        const messages = await pMessage.findMany({ where: { chat } });
        return { ...chat, messages };
      })
    );

    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const chat = await pChat.findFirstOrThrow({ where: { id: req.params.id } });
    const messages = await pMessage.findMany({ where: { chat } });
    res.json({ ...chat, messages });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id/messages", async (req: any, res: any) => {
  try {
    const messages = await pMessage.findMany({
      where: { chatId: req.params.id },
    });
    res.json(messages);
  } catch (error: any) {
    res.status(422).json({ error: error.message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const chat = await pChat.create({
      data: {
        name: req.body.name,
        prompt: req.body.prompt,
        temperature: req.body.temperature,
        folderId: req.body.folderId,
        userId: req.user.id,
        modelId: req.body.modelId,
      },
    });

    res.json(chat);
  } catch (error: any) {
    res.status(422).json({ error: error.message });
  }
});

router.post("/:id/messages", async (req: any, res: any) => {
  try {
    const message = await pMessage.create({
      data: {
        role: req.body.role,
        content: req.body.content,
        chatId: req.params.id,
      },
    });

    res.json(message);
  } catch (error: any) {
    res.status(422).json({ error: error.message });
  }
});

router.put("/:id/messages/:messageId", async (req: any, res: any) => {
  try {
    const message = await pMessage.update({
      where: { id: req.params.messageId },
      data: {
        role: req.body.role,
        content: req.body.content,
      },
    });

    res.json(message);
  } catch (error: any) {
    res.status(422).json({ error: error.message });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    await pChat.delete({ where: { id: req.params.id } });
    res.status(201).end();
  } catch (error: any) {
    console.error(error);
    res
      .status(422)
      .json({ error: `Failed to delete chat id: ${req.params.id}` });
  }
});

router.delete("/:id/messages/:messageId", async (req: any, res: any) => {
  try {
    await pMessage.delete({ where: { id: req.params.messageId } });
    res.status(201).end();
  } catch (error: any) {
    console.error(error);
    res
      .status(422)
      .json({ error: `Failed to delete message id: ${req.params.messageId}` });
  }
});

module.exports = router;
