-- AlterTable
ALTER TABLE `Journal` ADD COLUMN `folderId` VARCHAR(191) NULL,
    ADD COLUMN `lastOpenedAt` DATETIME(3) NULL,
    ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `JournalPage` ADD COLUMN `bookmarkedAt` DATETIME(3) NULL,
    ADD COLUMN `revision` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `JournalFolder` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `JournalFolder_userId_sortOrder_idx`(`userId`, `sortOrder`),
    INDEX `JournalFolder_userId_deletedAt_idx`(`userId`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Journal_userId_folderId_sortOrder_idx` ON `Journal`(`userId`, `folderId`, `sortOrder`);

-- CreateIndex
CREATE INDEX `Journal_folderId_deletedAt_idx` ON `Journal`(`folderId`, `deletedAt`);

-- AddForeignKey
ALTER TABLE `JournalFolder` ADD CONSTRAINT `JournalFolder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Journal` ADD CONSTRAINT `Journal_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `JournalFolder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
