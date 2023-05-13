import { PrismaClient, FolderType } from "@prisma/client";

const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  const folders = await prisma.folder.findMany();
  res.json(folders);
});

router.get("/:id", async (req: any, res: any) => {
  return await prisma.folder
    .findMany({
      where: {
        id: req.params.id,
      },
    })
    .then((folders) => {
      res.json(folders);
    })
    .catch((e) => {
      res.status(404).json({ error: "Folder not found" });
    });
});

router.post("/", async (req: any, res: any) => {
  const type = req.body.type === "chat" ? FolderType.CHAT : FolderType.PROMPT;
  return await prisma.folder
    .create({
      data: {
        name: req.body.name,
        type,
        userId: req.user.id,
      },
    })
    .then((folder) => {
      res.json(folder);
    })
    .catch((e) => {
      res.status(422).json({ error: e.message });
    });
});

router.put("/:id", async (req: any, res: any) => {
  const type = req.body.type === "chat" ? FolderType.CHAT : FolderType.PROMPT;
  return await prisma.folder
    .update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        type,
      },
    })
    .then((folder) => {
      res.json(folder);
    })
    .catch((e) => {
      res
        .status(422)
        .json({ error: `Fail to update folder id: ${req.params.id}` });
    });
});

router.delete("/:id", async (req: any, res: any) => {
  return await prisma.folder
    .delete({
      where: {
        id: req.params.id,
      },
    })
    .then(() => {
      res.status(201).end();
    })
    .catch((e) => {
      console.log(e);
      res
        .status(422)
        .json({ error: `Fail to delete folder id: ${req.params.id}` });
    });
});

module.exports = router;
