/*
  Warnings:

  - Added the required column `restaurantId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `restaurantId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `restaurantId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product_category` ADD COLUMN `restaurantId` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `product_category` ADD CONSTRAINT `product_category_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
