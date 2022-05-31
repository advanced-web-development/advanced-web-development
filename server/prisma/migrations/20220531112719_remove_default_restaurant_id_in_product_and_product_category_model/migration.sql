-- DropIndex
DROP INDEX `menu_name_key` ON `menu`;

-- DropIndex
DROP INDEX `product_category_name_key` ON `product_category`;

-- AlterTable
ALTER TABLE `menu` ALTER COLUMN `restaurantId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `product_category` ALTER COLUMN `restaurantId` DROP DEFAULT;
