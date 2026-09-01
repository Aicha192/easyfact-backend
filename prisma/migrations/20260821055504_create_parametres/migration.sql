-- CreateTable
CREATE TABLE `Parametres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomEntreprise` VARCHAR(191) NOT NULL,
    `responsable` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `siteWeb` VARCHAR(191) NOT NULL,
    `ninea` VARCHAR(191) NOT NULL,
    `rccm` VARCHAR(191) NOT NULL,
    `devise` VARCHAR(191) NOT NULL,
    `conditionsPaiement` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
