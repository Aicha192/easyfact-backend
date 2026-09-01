-- CreateTable
CREATE TABLE `Proforma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `client` VARCHAR(191) NOT NULL,
    `dateEmission` DATETIME(3) NOT NULL,
    `dateValidite` DATETIME(3) NOT NULL,
    `montantHT` DOUBLE NOT NULL,
    `tva` DOUBLE NOT NULL,
    `montantTTC` DOUBLE NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `factureNumero` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProformaItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `designation` VARCHAR(191) NOT NULL,
    `quantite` DOUBLE NOT NULL,
    `prixUnitaire` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `proformaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProformaItem` ADD CONSTRAINT `ProformaItem_proformaId_fkey` FOREIGN KEY (`proformaId`) REFERENCES `Proforma`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
