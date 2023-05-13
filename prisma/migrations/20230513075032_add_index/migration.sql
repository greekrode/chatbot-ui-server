/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropTable
DROP TABLE "sessions";

-- CreateIndex
CREATE INDEX "chats_userId_modelId_folderId_idx" ON "chats"("userId", "modelId", "folderId");

-- CreateIndex
CREATE INDEX "folders_userId_idx" ON "folders"("userId");

-- CreateIndex
CREATE INDEX "messages_chatId_idx" ON "messages"("chatId");

-- CreateIndex
CREATE INDEX "prompts_userId_modelId_folderId_idx" ON "prompts"("userId", "modelId", "folderId");
