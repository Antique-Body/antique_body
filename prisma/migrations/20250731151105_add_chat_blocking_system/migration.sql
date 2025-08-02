-- CreateTable
CREATE TABLE "ChatBlock" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatBlock_blockerId_idx" ON "ChatBlock"("blockerId");

-- CreateIndex
CREATE INDEX "ChatBlock_blockedId_idx" ON "ChatBlock"("blockedId");

-- CreateIndex
CREATE INDEX "ChatBlock_chatId_idx" ON "ChatBlock"("chatId");

-- CreateIndex
CREATE INDEX "ChatBlock_createdAt_idx" ON "ChatBlock"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChatBlock_blockerId_blockedId_chatId_key" ON "ChatBlock"("blockerId", "blockedId", "chatId");

-- AddForeignKey
ALTER TABLE "ChatBlock" ADD CONSTRAINT "ChatBlock_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatBlock" ADD CONSTRAINT "ChatBlock_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
