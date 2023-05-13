import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  console.log("here");
  const prompts = await prisma.prompt.findMany();
  res.json(prompts);
});

router.get("/:id", async (req: any, res: any) => {
  return await prisma.prompt
    .findMany({
      where: {
        id: req.params.id,
      },
    })
    .then((prompts) => {
      res.json(prompts);
    })
    .catch((e) => {
      res.status(404).json({ error: "Folder not found" });
    });
});

router.post("/", async (req: any, res: any) => {
  return await prisma.prompt
    .create({
      data: {
        name: req.body.name,
        content: req.body.content,
        description: req.body.description,
        folderId: req.body.folderId,
        modelId: req.body.modelId,
        userId: req.user.id,
      },
    })
    .then((prompt) => {
      res.json(prompt);
    })
    .catch((e) => {
      res.status(422).json({ error: e.message });
    });
});

router.put("/:id", async (req: any, res: any) => {
  return await prisma.prompt
    .update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        content: req.body.content,
        description: req.body.description,
        folderId: req.body.folderId,
        modelId: req.body.modelId,
        userId: req.user.id,
      },
    })
    .then((prompt) => {
      res.json(prompt);
    })
    .catch((e) => {
      res
        .status(422)
        .json({ error: `Fail to update prompt id: ${req.params.id}` });
    });
});

router.delete("/:id", async (req: any, res: any) => {
  return await prisma.prompt
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
        .json({ error: `Fail to delete prompt id: ${req.params.id}` });
    });
});

module.exports = router;
