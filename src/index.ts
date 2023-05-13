import express from "express";
import * as dotenv from "dotenv";
import middleware from "./middleware";

const app = express();

const promptRoutes = require("./routes/prompts");
const folderRoutes = require("./routes/folders");
const authRoutes = require("./routes/auth");
const chatsRoutes = require("./routes/chats");

dotenv.config();
app.use(express.json());

app.use("/prompts", promptRoutes);
app.use("/folders", middleware, folderRoutes);
app.use("/chats", middleware, chatsRoutes);
app.use("/", authRoutes);

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);
