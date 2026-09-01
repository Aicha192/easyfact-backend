/*
  Warnings:

  - Made the column `entrepriseId` on table `facture` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `facture` DROP FOREIGN KEY `Facture_entrepriseId_fkey`;

-- DropIndex
DROP INDEX `Facture_entrepriseId_fkey` ON `facture`;

-- AlterTable
ALTER TABLE `facture` MODIFY `entrepriseId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
