-- AlterTable
ALTER TABLE `facture` ADD COLUMN `entrepriseId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
