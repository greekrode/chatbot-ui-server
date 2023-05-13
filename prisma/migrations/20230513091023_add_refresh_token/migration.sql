-- DropIndex
DROP INDEX "chats_userId_modelId_folderId_idx";

-- DropIndex
DROP INDEX "prompts_userId_modelId_folderId_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE INDEX "chats_userId_idx" ON "chats"("userId");

-- CreateIndex
CREATE INDEX "chats_modelId_idx" ON "chats"("modelId");

-- CreateIndex
CREATE INDEX "chats_folderId_idx" ON "chats"("folderId");

-- CreateIndex
CREATE INDEX "prompts_userId_idx" ON "prompts"("userId");

-- CreateIndex
CREATE INDEX "prompts_modelId_idx" ON "prompts"("modelId");

-- CreateIndex
CREATE INDEX "prompts_folderId_idx" ON "prompts"("folderId");

-- CreateIndex
CREATE INDEX "users_refreshToken_idx" ON "users"("refreshToken");
