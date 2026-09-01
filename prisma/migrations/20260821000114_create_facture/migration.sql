-- CreateTable
CREATE TABLE `Facture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `client` VARCHAR(191) NOT NULL,
    `dateEmission` DATETIME(3) NOT NULL,
    `dateEcheance` DATETIME(3) NOT NULL,
    `montantHT` DOUBLE NOT NULL,
    `tva` DOUBLE NOT NULL,
    `montantTTC` DOUBLE NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FactureItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `designation` VARCHAR(191) NOT NULL,
    `quantite` DOUBLE NOT NULL,
    `prixUnitaire` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,
    `factureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FactureItem` ADD CONSTRAINT `FactureItem_factureId_fkey` FOREIGN KEY (`factureId`) REFERENCES `Facture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
