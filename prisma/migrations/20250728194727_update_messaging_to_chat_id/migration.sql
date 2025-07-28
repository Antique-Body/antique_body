/*
  Warnings:

  - You are about to drop the column `coachingRequestId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `coachingRequestId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_coachingRequestId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_coachingRequestId_fkey";

-- DropIndex
DROP INDEX "Conversation_coachingRequestId_key";

-- DropIndex
DROP INDEX "Message_coachingRequestId_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "coachingRequestId",
ADD COLUMN     "chatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "coachingRequestId",
ADD COLUMN     "chatId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_chatId_key" ON "Conversation"("chatId");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");
