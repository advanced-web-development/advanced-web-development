-- AlterTable
ALTER TABLE `user` ADD COLUMN `restaurantId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
